import { useState } from 'react';
import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useHistory } from 'react-router-dom';
import calculateEstimate from '../lib/estimates';

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
    const currentTimestamp = Math.floor(Date.now() / 86400000);
    const latestInterval = currentTimestamp - itemData.last_purchased;

    if (e.target.checked === true) {
      if (itemData.times_purchased === 0) {
        const initialEstimate = calculateEstimate(
          itemData.last_estimate,
          itemData.purchase_frequency,
          itemData.times_purchased,
        );
        db.collection(token)
          .doc(id)
          .update({
            last_purchased: currentTimestamp,
            times_purchased: itemData.times_purchased + 1,
            last_estimate: initialEstimate,
          });
      } else {
        const latestEstimate = calculateEstimate(
          itemData.last_estimate,
          latestInterval,
          itemData.times_purchased,
        );
        db.collection(token)
          .doc(id)
          .update({
            last_purchased: currentTimestamp,
            times_purchased: itemData.times_purchased + 1,
            last_estimate: latestEstimate,
          });
      }
    }
  };

  function compareTimeStamps(lastPurchased) {
    const currentTimestamp = Math.floor(Date.now() / 86400000);
    return currentTimestamp - lastPurchased < 1;
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

  const checkForInactiveItem = (item) =>
    Math.floor(Date.now() / 86400000) - item.data().last_purchased <
    item.data().last_estimate;

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
                      item.data().last_estimate <= 7 &&
                      checkForInactiveItem(item)
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
                      item.data().last_estimate > 7 &&
                      item.data().last_estimate <= 14 &&
                      checkForInactiveItem(item)
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
                      item.data().last_estimate > 14 &&
                      checkForInactiveItem(item)
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
                .filter(
                  (item) =>
                    (Math.floor(Date.now() / 86400000) -
                      item.data().last_purchased) *
                      2 >
                      item.data().last_estimate &&
                    item.data().last_estimate !== null,
                )

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
