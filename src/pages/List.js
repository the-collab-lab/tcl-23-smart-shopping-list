import { useState } from 'react';
import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import calculateEstimate from '../lib/estimates';
import { DateTime, Interval } from 'luxon';
import Button from '../components/Button';
import IconButton from '../components/IconButton';

export default function List({ token }) {
  const history = useHistory();
  const [listItems, loading, error] = useCollection(db.collection(token), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [query, setQuery] = useState('');

  function handleReset() {
    setQuery('');
  }

  const calculateLatestInterval = (lastPurchased, currentDateTime) => {
    return Math.floor(
      Interval.fromDateTimes(DateTime.fromISO(lastPurchased), currentDateTime)
        .toDuration('days')
        .toObject().days,
    );
  };

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
        const latestInterval = calculateLatestInterval(
          itemData.last_purchased,
          currentDateTime,
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

    // determine the amount days between now and last_purchase
    const currentDateTime = DateTime.now();
    const latestInterval = calculateLatestInterval(
      lastPurchased,
      currentDateTime,
    );

    return latestInterval === 0;
  }

  const checkForInactiveItem = (itemData) => {
    // pass in the item and create a variable for item.data() here
    const item = itemData.data();

    if (item.times_purchased === 1) {
      return true;
    }

    // calculate if the duration between now and last_purchased is greater than DOUBLE the last_estimate
    const doubleLastEstimate = item.last_estimate * 2;
    const currentDateTime = DateTime.now();
    const latestInterval = calculateLatestInterval(
      itemData.last_purchased,
      currentDateTime,
    );

    if (latestInterval > doubleLastEstimate) {
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </li>
    );
  };

  return (
    <>
      <h1>This Is Your Grocery List</h1>
      <h2>It uses the token: {token}</h2>
      <label htmlFor="thesearch">Search Grocery List Items </label>
      <div className="flex">
        <input
          type="text"
          placeholder="enter grocery item"
          value={query}
          id="thesearch"
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton
          onClick={handleReset}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          }
          label="clear input"
        />
      </div>

      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Grocery List: Loading...</span>}
      {listItems && (
        <>
          <h2>Grocery List:</h2>
          {listItems.docs.length === 0 ? (
            <section className="flex flex-col items-center w-full">
              <p>Your grocery list is currently empty.</p>
              <Button
                onClick={() => history.push('/add-item')}
                text="+ Click to add your first item"
              />
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
