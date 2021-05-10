import { useState } from 'react';
import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useHistory } from 'react-router-dom';
import calculateEstimate from '../lib/estimates';

export default function List({ token }) {
  const history = useHistory();
  const [listItem, loading, error] = useCollection(db.collection(token), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [query, setQuery] = useState('');

  function handleReset() {
    setQuery('');
  }

  const markItemPurchased = (e, id, itemData) => {
    const currentTimestamp = Date.now();
    const initialInterval = itemData.purchase_frequency * 86400000;
    const latestInterval = currentTimestamp - itemData.last_purchased;

    // const markItemPurchased = (e, id) => {
    //   const elapsedMilliseconds = Date.now();

    if (e.target.checked === true) {
      if (itemData.times_purchased === 0) {
        const initialEstimate = calculateEstimate(
          itemData.last_estimate,
          initialInterval,
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
    const currentElapsedMilliseconds = Date.now();
    const millisecondsInOneDay = 86400000;
    return currentElapsedMilliseconds - lastPurchased < millisecondsInOneDay;
  }

  function deleteItem(id) {
    if (window.confirm("Are you sure you'd like to delete this item?")) {
      db.collection(token)
        .doc(id)
        .delete()
        .then(() => {
          console.log('it was deleted');
        });
    } else {
      console.log('item not deleted');
    }
  }
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
      {listItem && (
        <>
          <h2>Grocery List:</h2>
          {listItem.docs.length === 0 ? (
            <section>
              <p>Your grocery list is currently empty.</p>
              <button onClick={() => history.push('/add-item')}>
                Click to add first item!
              </button>
            </section>
          ) : (
            <ul>
              {listItem.docs
                .filter(
                  (doc) =>
                    doc.data().item_name.includes(query.toLowerCase().trim()) ||
                    query === '',
                )

                .map((doc, index) => (
                  <li key={doc.id} className="checkbox-wrapper">
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
                      <button key={doc.id} onClick={() => deleteItem(doc.id)}>
                        Delete
                      </button>
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
