import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function List(props) {
  const [listItem, loading, error] = useCollection(db.collection(props.token), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const markItemPurchased = (e, id) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    if (e.target.checked === true) {
      db.collection(props.token).doc(id).update({
        last_purchased: today.toUTCString(),
      });
    }
  };

  return (
    <>
      <h1>THIS IS THE LIST</h1>
      <h2>Your token: {props.token}</h2>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      {listItem && (
        <>
          <span>Your Shopping List:</span>
          <ul>
            {listItem.docs.map((doc) => (
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  onClick={(e) => markItemPurchased(e, doc.id)}
                />
                <li key={doc.id}>{doc.data().item_name}</li>
              </div>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
