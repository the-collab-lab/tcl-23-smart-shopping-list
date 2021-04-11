import React from 'react';
import { db } from './lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './stylesheets/App.css';
import List from './pages/List';
import AddItem from './pages/AddItem';
import NavBar from './components/NavBar';

const App = () => {
  const [value, loading, error] = useCollection(db.collection('list'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const sendItem = () => {
    db.collection('list')
      .add({ title: 'first item', description: 'new item' })
      .then((documentReference) => {
        console.log('document reference ID', documentReference.id);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <List />
          </Route>

          <Route exact path="/add-item">
            <AddItem />
          </Route>
        </Switch>
        <NavBar />

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
      </div>
    </Router>
  );
};

export default App;
