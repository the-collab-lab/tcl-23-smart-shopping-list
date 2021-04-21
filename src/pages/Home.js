import { addKeyValuePairToLocalStorage } from '../lib/localStorage';
import getToken from '../lib/tokens';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../lib/firebase';
import swal from 'sweetalert';

export default function Home(props) {
  const history = useHistory();
  const [inputValue, setInputValue] = useState('');

  function handleClick() {
    const token = getToken();
    addKeyValuePairToLocalStorage('token', token);
    props.setToken(token);
    history.push('/list');
  }

  function handleInputValue(e) {
    setInputValue(e.target.value);
  }

  function checkExistingToken(e) {
    e.preventDefault();
    if (!inputValue) {
      return swal('Please enter your token!', 'Input is empty', 'error');
    }
    db.collection(inputValue)
      .get()
      .then((snap) => {
        if (snap.empty) {
          swal(
            'Token not found!',
            'Please try again or start a new list!',
            'error',
          );
          setInputValue('');
        } else {
          addKeyValuePairToLocalStorage('token', inputValue);
          props.setToken(inputValue);
          history.push('/list');
        }
      });
  }

  return (
    <main>
      <h1>Welcome screen</h1>
      <h2>Add a new list:</h2>
      <button onClick={handleClick}>Add List</button>
      <h2>Join an existing list</h2>
      <form onSubmit={checkExistingToken}>
        <label htmlFor="token">
          Please Insert Token:
          <input
            type="text"
            name="token"
            placeholder="Three word token"
            value={inputValue}
            onChange={handleInputValue}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </main>
  );
}
