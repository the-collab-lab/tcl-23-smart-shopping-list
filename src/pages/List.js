import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useHistory } from 'react-router-dom';

export default function List({ token }) {
  const history = useHistory();
  const [listItem, loading, error] = useCollection(db.collection(token), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const markItemPurchased = (e, id) => {
    const elapsedMilliseconds = Date.now();

    if (e.target.checked === true) {
      db.collection(token).doc(id).update({
        last_purchased: elapsedMilliseconds,
      });
    }
  };

  function compareTimeStamps(lastPurchased) {
    const currentElapsedMilliseconds = Date.now();
    const millisecondsInOneDay = 86400000;
    return currentElapsedMilliseconds - lastPurchased < millisecondsInOneDay;
  }

  return (
    <>
      <h1>This Is Your Grocery List</h1>
      <h2>It uses the token: {token}</h2>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Grocery List: Loading...</span>}
      {listItem && (
        <>
          <span>Grocery List:</span>
          {listItem.docs.length === 0 ? (
            <section>
              <p>Your grocery list is currently empty.</p>
              <button onClick={() => history.push('/add-item')}>
                Click to add first item!
              </button>
            </section>
          ) : (
            <ul>
              {listItem.docs.map((doc) => (
                <li key={doc.id} className="checkbox-wrapper">
                  <label>
                    <input
                      type="checkbox"
                      defaultChecked={compareTimeStamps(
                        doc.data().last_purchased,
                      )}
                      disabled={compareTimeStamps(doc.data().last_purchased)}
                      onClick={(e) => markItemPurchased(e, doc.id)}
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
