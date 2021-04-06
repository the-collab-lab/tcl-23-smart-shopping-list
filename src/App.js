import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './stylesheets/App.css';
import List from './pages/List';
import AddItem from './pages/AddItem';
import NavBar from './components/NavBar';

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
        <NavBar />
      </div>
    </Router>
  );
}

export default App;
