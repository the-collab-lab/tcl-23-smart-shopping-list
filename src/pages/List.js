import { useState } from 'react';
import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import calculateEstimate from '../lib/estimates';
import { DateTime, Interval } from 'luxon';

export default function List({ token }) {
  const history = useHistory();
  const [listItems, loading, error] = useCollection(db.collection(token), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [query, setQuery] = useState('');

  function handleReset() {
    setQuery('');
  }

  const markItemPurchased = (e, id, itemData) => {
    const currentDateTime = DateTime.now();

    if (e.target.checked === true) {
      // if an item has not yet been purchased, last_estimate has no value, so we initialize with the user's selected purchase_frequency
      if (itemData.times_purchased === 0) {
        db.collection(token)
          .doc(id)
          .update({
            last_purchased: currentDateTime.toString(),
            times_purchased: itemData.times_purchased + 1,
            last_estimate: itemData.purchase_frequency,
          });
      } else {
        // if an item has at least 1 times_purchased, calculate the latestInterval with Interval from Luxon
        // and use the previous last_estimate property to update the database's last_estimate property with latestEstimate
        const latestInterval = Math.floor(
          Interval.fromDateTimes(
            DateTime.fromISO(itemData.last_purchased),
            currentDateTime,
          )
            .toDuration('days')
            .toObject().days,
        );

        const latestEstimate = calculateEstimate(
          itemData.last_estimate,
          latestInterval,
          itemData.times_purchased,
        );

        db.collection(token)
          .doc(id)
          .update({
            last_purchased: currentDateTime.toString(),
            times_purchased: itemData.times_purchased + 1,
            last_estimate: latestEstimate,
          });
      }
    }
  };

  function compareTimeStamps(lastPurchased) {
    // first check to see if lastPurchased === null in database
    if (lastPurchased === null) {
      return false;
    }
    // use DateTime package to get current time
    const now = DateTime.now();

    // initialize how many milliseconds there are in a day for calculation
    const millisecondsInADay = 86400000;

    // convert now to days
    const nowInDays = Math.floor(now.ts / millisecondsInADay);

    // do the same conversion for last_purchased as lastPurchased
    const lastPurchasedToDays = Math.floor(
      DateTime.fromISO(lastPurchased).ts / millisecondsInADay,
    );

    return nowInDays - lastPurchasedToDays === 0;
  }

  const checkForInactiveItem = (itemData) => {
    // pass in the item and create a variable for item.data() here
    const item = itemData.data();

    if (item.times_purchased === 1) {
      return true;
    }

    // use DateTime package to get current time
    const now = DateTime.now();

    // initialize how many milliseconds there are in a day for calculation
    const millisecondsInADay = 86400000;

    // convert now to days
    const nowInDays = Math.floor(now.ts / millisecondsInADay);

    // do the same conversion for last_purchased as lastPurchased
    const lastPurchasedToDays = Math.floor(
      DateTime.fromISO(item.last_purchased).ts / millisecondsInADay,
    );

    // calculate if item last_purchase is over double since last_estimate
    const doubleLastEstimate = item.last_estimate * 2;
    const timeEllapsed = nowInDays - lastPurchasedToDays;

    if (timeEllapsed > doubleLastEstimate) {
      return true;
    }
    return false;
  };

  function deleteItem(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
        db.collection(token).doc(id).delete();
      }
    });
  }

  const alphabetizeListItems = (list) => {
    const sortedList = list.sort((a, b) => {
      if (a.data().item_name.toLowerCase() < b.data().item_name.toLowerCase()) {
        return -1;
      }
      if (a.data().item_name.toLowerCase() > b.data().item_name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    return sortedList;
  };

  const filterByUserInput = (item) => {
    // first alphabetize all the items then filter for the user's searched item(s)
    return alphabetizeListItems(item.docs).filter(
      (doc) =>
        doc
          .data()
          .item_name.toLowerCase()
          .includes(query.toLowerCase().trim()) || query === '',
    );
  };

  const filterByLessThanSevenDays = (listItems) => {
    // filter the items by user input or render all items if no input
    const alphabetizedUserInputOrAllItems = filterByUserInput(listItems);

    // filter into the green category of less than 7 days
    return alphabetizedUserInputOrAllItems.filter((item) => {
      if (item.data().times_purchased === 0) {
        return item.data().purchase_frequency === 7;
      } else {
        return item.data().last_estimate < 7 && !checkForInactiveItem(item);
      }
    });
  };

  const filterByMoreThanSevenDaysAndLessThanThirtyDays = (listItems) => {
    // filter the items by user input or render all items if no input
    const alphabetizedUserInputOrAllItems = filterByUserInput(listItems);

    // filter items into the purple category of more than 7 days and less than 30 days
    return alphabetizedUserInputOrAllItems.filter((item) => {
      if (item.data().times_purchased === 0) {
        return item.data().purchase_frequency === 14;
      } else {
        return (
          item.data().last_estimate >= 7 &&
          item.data().last_estimate <= 30 &&
          !checkForInactiveItem(item)
        );
      }
    });
  };

  const filterByMoreThanThirtyDays = (listItems) => {
    // filter the items by user input or render all items if no input
    const alphabetizedUserInputOrAllItems = filterByUserInput(listItems);

    // filter items into the red category of more than 30 days
    return alphabetizedUserInputOrAllItems.filter((item) => {
      if (item.data().times_purchased === 0) {
        return item.data().purchase_frequency === 30;
      } else {
        return item.data().last_estimate > 30 && !checkForInactiveItem(item);
      }
    });
  };

  const filterByInactiveItems = (listItems) => {
    // filter the items by user input or render all items if no input
    const alphabetizedUserInputOrAllItems = filterByUserInput(listItems);

    // filter items into the gray category of more than double last_estimate
    return alphabetizedUserInputOrAllItems.filter((item) =>
      checkForInactiveItem(item),
    );
  };

  const renderUnorderedList = (doc, color) => {
    return (
      <li key={doc.id} className="checkbox-wrapper" style={{ color: color }}>
        <input
          type="checkbox"
          id={doc.id}
          defaultChecked={compareTimeStamps(doc.data().last_purchased)}
          disabled={compareTimeStamps(doc.data().last_purchased)}
          onClick={(e) => markItemPurchased(e, doc.id, doc.data())}
        />
        <label htmlFor={doc.id}>{doc.data().item_name}</label>
        <button key={doc.id} onClick={() => deleteItem(doc.id)}>
          Delete
        </button>
      </li>
    );
  };

  return (
    <>
      <h1>This Is Your Grocery List</h1>
      <h2>It uses the token: {token}</h2>
      <label htmlFor="thesearch">Search Grocery List Items </label>
      <input
        type="text"
        placeholder="enter grocery item"
        value={query}
        id="thesearch"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleReset}>Reset Text Field</button>

      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Grocery List: Loading...</span>}
      {listItems && (
        <>
          <h2>Grocery List:</h2>
          {listItems.docs.length === 0 ? (
            <section>
              <p>Your grocery list is currently empty.</p>
              <button onClick={() => history.push('/add-item')}>
                Click to add first item!
              </button>
            </section>
          ) : (
            <ul>
              {filterByLessThanSevenDays(listItems).map((doc) =>
                renderUnorderedList(doc, 'green'),
              )}

              {filterByMoreThanSevenDaysAndLessThanThirtyDays(
                listItems,
              ).map((doc) => renderUnorderedList(doc, 'purple'))}

              {filterByMoreThanThirtyDays(listItems).map((doc) =>
                renderUnorderedList(doc, 'red'),
              )}

              {filterByInactiveItems(listItems).map((doc) =>
                renderUnorderedList(doc, 'gray'),
              )}
            </ul>
          )}
        </>
      )}
    </>
  );
}
