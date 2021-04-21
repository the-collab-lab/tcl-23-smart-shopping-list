import {
  checkLocalStorageForKey,
  addKeyValuePairToLocalStorage,
} from '../lib/localStorage';
import getToken from '../lib/tokens';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../lib/firebase';
import swal from 'sweetalert';

export default function Home(props) {
  const retrievedToken = checkLocalStorageForKey('token', '');
  const history = useHistory();
  const inputRef = useRef();

  function handleClick() {
    const token = getToken();
    addKeyValuePairToLocalStorage('token', token);
    props.setToken(token);
    history.push('/list');
  }

  function checkExistingToken(e) {
    e.preventDefault();
    let inputValue = inputRef.current.value;
    db.collection(inputValue)
      .get()
      .then((snap) => {
        if (snap.empty) {
          swal(
            'Token not found!',
            'Please try again or start a new list!',
            'error',
          );
        } else {
          addKeyValuePairToLocalStorage('token', inputValue);
          props.setToken(inputValue);
          history.push('/list');
        }
      });
  }

  return (
    <main>
      {retrievedToken ? history.push('/list') : ''}
      <h1>Welcome screen</h1>
      <h2>Add a new list:</h2>
      <button onClick={handleClick}>Add List</button>
      <h2>Join an existing list</h2>
      <form onSubmit={checkExistingToken}>
        <label>
          Please Insert Token:
          <input
            type="text"
            name="token"
            placeholder="Three word token"
            ref={inputRef}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </main>
  );
}
