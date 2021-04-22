import React, { useEffect, useState } from 'react';
import { db } from './lib/firebase';
import { checkLocalStorageForKey } from './lib/localStorage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
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
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home setToken={setToken} />
          </Route>
          <Route exact path="/list">
            {token && listItems ? <List token={token} /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/add-item">
            <AddItem
              listItems={listItems}
              setListItems={setListItems}
              token={token}
            />
          </Route>
        </Switch>
        {token && <NavBar />}
      </div>
    </Router>
  );
};

export default App;
