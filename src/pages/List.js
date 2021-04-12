import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function List(props) {
  const [value, loading, error] = useCollection(
    db.collection('list').doc('user_1').collection('shopping_items'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
  return (
    <>
      <h1>THIS IS THE LIST</h1>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      {value && (
        <>
          <span>Collection:</span>
          <ul>
            {value.docs.map((doc) => (
              <li key={doc.id}>{JSON.stringify(doc.data())}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
