import React, { useEffect, useState } from 'react';
import { db } from './lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { checkLocalStorageForKey } from './lib/localStorage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './stylesheets/App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import List from './pages/List';
import AddItem from './pages/AddItem';

const App = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const retrievedToken = checkLocalStorageForKey('token', '');
    setToken(retrievedToken);
  }, []);

  // Comment out lines 21-26 and Un-comment lines 28-33. It won't accept the `token`
  // const [listItems, loading, error] = useCollection(
  //   db.collection('sire agnew dutch'),
  //   {
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   },
  // );

  // const [listItems, loading, error] = useCollection(db.collection(token), {
  //   snapshotListenOptions: { includeMetadataChanges: true },
  // });

  return (
    <Router>
      <main className="App">
        {token ? (
          <>
            <NavBar />
            <Switch>
              <Route exact path="/">
                <List token={token} />
              </Route>
              <Route exact path="/list">
                <List token={token} />
              </Route>
              <Route exact path="/add-item">
                <AddItem token={token} />
              </Route>
            </Switch>
          </>
        ) : (
          <Home setToken={setToken} />
        )}
      </main>
    </Router>
  );
};

export default App;
