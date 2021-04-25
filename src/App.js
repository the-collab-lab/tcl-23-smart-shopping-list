import React, { useEffect, useState } from 'react';
import { db } from './lib/firebase';
import { checkLocalStorageForKey } from './lib/localStorage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './stylesheets/App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import List from './pages/List';
import AddItem from './pages/AddItem';

const App = () => {
  const [token, setToken] = useState('');
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    const retrievedToken = checkLocalStorageForKey('token', '');
    setToken(retrievedToken);
  }, []);

  useEffect(() => {
    if (token) {
      db.collection(token)
        .get()
        .then((querySnapshot) => {
          const listItemData = [];

          querySnapshot.forEach((doc) => {
            listItemData.push(doc.data());
          });
          setListItems(listItemData);
        });
    }
  }, [token]);

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
                <AddItem
                  listItems={listItems}
                  setListItems={setListItems}
                  token={token}
                />
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
