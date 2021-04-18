import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const retrievedToken = checkLocalStorageForKey('token', '');
    setToken(retrievedToken);
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home setToken={setToken} />
          </Route>
          <Route exact path="/list">
            {token ? <List token={token} /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/add-item">
            <AddItem />
          </Route>
        </Switch>
        {token && <NavBar />}
      </div>
    </Router>
  );
};

export default App;
