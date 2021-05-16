import { useState } from 'react';
import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useHistory } from 'react-router-dom';
import calculateEstimate from '../lib/estimates';
import { DateTime } from 'luxon';

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
    // use DateTime package to get current time
    const now = DateTime.now();
    // convert now to readable ISO string
    const nowToString = now.toString();

    // initialize how many milliseconds there are in a day for calculation
    const millisecondsInADay = 86400000;

    // because last_estimate is an integer representing days, convert now to days
    const nowInDays = Math.floor(now.ts / millisecondsInADay);

    // do the same conversion for last_purchased
    const lastPurchasedToDays = Math.floor(
      DateTime.fromISO(itemData.last_purchased).ts / millisecondsInADay,
    );

    // determine the amount of days between now and when item was last marked purchased
    const latestInterval = nowInDays - lastPurchasedToDays;

    if (e.target.checked === true) {
      // if an item does has not yet been purchased, there isn't a last_estimate value, so we initialize with the user's selected purchase_frequency
      if (itemData.times_purchased === 0) {
        db.collection(token)
          .doc(id)
          .update({
            last_purchased: nowToString,
            times_purchased: itemData.times_purchased + 1,
            last_estimate: itemData.purchase_frequency,
          });
        // if an item has at least 1 times_purchased, we use the last_estimate property to update the database last_estimate property
      } else {
        const latestEstimate = calculateEstimate(
          itemData.last_estimate,
          latestInterval,
          itemData.times_purchased,
        );
        db.collection(token)
          .doc(id)
          .update({
            last_purchased: nowToString,
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

  const alphabetizeListItems = (list) => {
    const sortedList = list.sort((a, b) => {
      if (a.data().item_name < b.data().item_name) {
        return -1;
      }
      if (a.data().item_name > b.data().item_name) {
        return 1;
      }
      return 0;
    });
    return sortedList;
  };

  const checkForInactiveItem = (item) => {
    // pass in the item and create a variable for item.data() here
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
    const doubleLastEstimate = item.last_estimate * 2;
    const timeEllapsed = nowInDays - lastPurchasedToDays;

    if (timeEllapsed > doubleLastEstimate) {
      return true;
    }
    return false;
  };

  return (
    <>
      <h1>This Is Your Grocery List</h1>
      <h2>It uses the token: {token}</h2>
      <label htmlFor="thesearch">
        Search Grocery List Items
        <input
          type="text"
          placeholder="enter grocery item"
          value={query}
          id="thesearch"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleReset}>Reset Text Field</button>
      </label>
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
              {alphabetizeListItems(listItems.docs)
                .filter(
                  (doc) =>
                    doc
                      .data()
                      .item_name.toLowerCase()
                      .includes(query.toLowerCase().trim()) || query === '',
                )
                .filter((item) => {
                  if (item.data().times_purchased === 0) {
                    return item.data().purchase_frequency === 7;
                  } else {
                    return (
                      item.data().last_estimate < 7 &&
                      !checkForInactiveItem(item.data())
                    );
                  }
                })

                .map((doc, index) => (
                  <li
                    key={doc.id}
                    className="checkbox-wrapper"
                    style={{ color: 'green', fontSize: '1.25rem' }}
                  >
                    <input
                      type="checkbox"
                      aria-label={`grocery-item${++index}`}
                      aria-required="true"
                      id={`grocery-item${++index}`}
                      defaultChecked={compareTimeStamps(
                        doc.data().last_purchased,
                      )}
                      disabled={compareTimeStamps(doc.data().last_purchased)}
                      onClick={(e) => markItemPurchased(e, doc.id, doc.data())}
                    />
                    {doc.data().item_name}
                  </li>
                ))}

              {alphabetizeListItems(listItems.docs)
                .filter(
                  (doc) =>
                    doc
                      .data()
                      .item_name.toLowerCase()
                      .includes(query.toLowerCase().trim()) || query === '',
                )
                .filter((item) => {
                  if (item.data().times_purchased === 0) {
                    return item.data().purchase_frequency === 14;
                  } else {
                    return (
                      item.data().last_estimate >= 7 &&
                      item.data().last_estimate <= 30 &&
                      !checkForInactiveItem(item.data())
                    );
                  }
                })

                .map((doc, index) => (
                  <li
                    key={doc.id}
                    className="checkbox-wrapper"
                    style={{ color: 'purple', fontSize: '1.25rem' }}
                  >
                    <input
                      type="checkbox"
                      aria-label={`grocery-item${++index}`}
                      aria-required="true"
                      id={`grocery-item${++index}`}
                      defaultChecked={compareTimeStamps(
                        doc.data().last_purchased,
                      )}
                      disabled={compareTimeStamps(doc.data().last_purchased)}
                      onClick={(e) => markItemPurchased(e, doc.id, doc.data())}
                    />
                    {doc.data().item_name}
                  </li>
                ))}

              {alphabetizeListItems(listItems.docs)
                .filter(
                  (doc) =>
                    doc
                      .data()
                      .item_name.toLowerCase()
                      .includes(query.toLowerCase().trim()) || query === '',
                )
                .filter((item) => {
                  if (item.data().times_purchased === 0) {
                    return item.data().purchase_frequency === 30;
                  } else {
                    return (
                      item.data().last_estimate > 30 &&
                      !checkForInactiveItem(item.data())
                    );
                  }
                })

                .map((doc, index) => (
                  <li
                    key={doc.id}
                    className="checkbox-wrapper"
                    style={{ color: 'red', fontSize: '1.25rem' }}
                  >
                    <input
                      type="checkbox"
                      aria-label={`grocery-item${++index}`}
                      aria-required="true"
                      id={`grocery-item${++index}`}
                      defaultChecked={compareTimeStamps(
                        doc.data().last_purchased,
                      )}
                      disabled={compareTimeStamps(doc.data().last_purchased)}
                      onClick={(e) => markItemPurchased(e, doc.id, doc.data())}
                    />
                    {doc.data().item_name}
                  </li>
                ))}

              {alphabetizeListItems(listItems.docs)
                .filter(
                  (doc) =>
                    doc
                      .data()
                      .item_name.toLowerCase()
                      .includes(query.toLowerCase().trim()) || query === '',
                )
                .filter((item) => checkForInactiveItem(item.data()))

                .map((doc, index) => (
                  <li
                    key={doc.id}
                    className="checkbox-wrapper"
                    style={{ color: 'gray', fontSize: '1.25rem' }}
                  >
                    <label htmlFor={`grocery-item${++index}`}>
                      <input
                        type="checkbox"
                        id={`grocery-item${++index}`}
                        defaultChecked={compareTimeStamps(
                          doc.data().last_purchased,
                        )}
                        disabled={compareTimeStamps(doc.data().last_purchased)}
                        onClick={(e) =>
                          markItemPurchased(e, doc.id, doc.data())
                        }
                      />
                      {doc.data().item_name}
                    </label>
                  </li>
                ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
