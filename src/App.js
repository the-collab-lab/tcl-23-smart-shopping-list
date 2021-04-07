import React from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase/index';

const App = () => {
  console.log(firebase.db);

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
    </div>
  );
};

// function App() {

// }

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

//  return (
//   <div className="App">
//     <header className="App-header">
//       <img src={logo} className="App-logo" alt="logo" />
//       <p>
//         Edit <code>src/App.js</code> and save to reload.
//       </p>
//       <a
//         className="App-link"
//         href="https://reactjs.org"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         Learn React
//       </a>
//     </header>
//   </div>
// );
// };
