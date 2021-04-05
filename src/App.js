import React from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

/*
const [list, setList] = React.useState([]); 
  React.useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore()
      const data = await db.collection("list").get()
      setData(data.map(doc => doc.data()))
    }//TODO: REPLACE WORD LIST WITH DATA ACCESS POINT
    
  }, [])
  */
