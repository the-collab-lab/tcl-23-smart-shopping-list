import React from 'react';
import './App.css';
import { firebase, db } from './lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

const App = () => {
  const [value, loading, error] = useCollection(
    firebase.firestore().collection('list'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );

  console.log({ firebase });
  console.log({ db });

  const sendItem = () => {
    firebase.db
      .collection('list')
      .add({ title: 'first item', description: 'new item' })
      .then((documentReference) => {
        console.log('document reference ID', documentReference.id);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div>
      <h1>Grocery List</h1>
      <button onClick={sendItem}>click here to add grocery item</button>
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <span>
            Collection:{' '}
            {value.docs.map((doc) => (
              <React.Fragment key={doc.id}>
                {JSON.stringify(doc.data())},{' '}
              </React.Fragment>
            ))}
          </span>
        )}
      </p>
    </div>
  );
};

export default App;
