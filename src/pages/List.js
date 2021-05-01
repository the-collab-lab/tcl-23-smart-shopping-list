import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function List(props) {
  const [listItem, loading, error] = useCollection(db.collection(props.token), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  return (
    <>
      <h1>This Is Your Grocery List</h1>
      <h2>It uses the token: {props.token}</h2>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Grocery List: Loading...</span>}
      {listItem && (
        <>
          <span>Grocery List:</span>
          <ul>
            {listItem.docs.map((doc) => (
              <li key={doc.id}>{JSON.stringify(doc.data())}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
