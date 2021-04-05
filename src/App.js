import React from 'react';
import logo from './logo.svg';
import './App.css';
import List from './pages/List';
import AddItem from './pages/AddItem';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
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
      </div>
    </Router>
  );
}

export default App;
