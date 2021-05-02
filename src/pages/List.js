import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function List(props) {
  const [listItem, loading, error] = useCollection(db.collection(props.token), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const markItemPurchased = (e, id) => {
    const elapsedMilliseconds = Date.now();

    if (e.target.checked === true) {
      db.collection(props.token).doc(id).update({
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
      <h1>Your token: {props.token}</h1>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      {listItem && (
        <>
          <span>Your Shopping List:</span>
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
        </>
      )}
    </>
  );
}
