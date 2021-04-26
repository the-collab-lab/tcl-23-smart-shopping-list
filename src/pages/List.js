import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function List(props) {
  const [listItem, loading, error] = useCollection(db.collection(props.token), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
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
                <input type="checkbox"></input>
                <li key={doc.id}>{doc.data().item_name}</li>
              </div>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
