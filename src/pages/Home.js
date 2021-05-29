import { addKeyValuePairToLocalStorage } from '../lib/localStorage';
import getToken from '../lib/tokens';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../lib/firebase';
import Swal from 'sweetalert2';
import Button from '../components/Button';
import IconButton from '../components/IconButton';

export default function Home(props) {
  const history = useHistory();
  const [inputValue, setInputValue] = useState('');

  function handleClick() {
    const token = getToken();
    addKeyValuePairToLocalStorage('token', token);
    props.setToken(token);
    Swal.fire({
      icon: 'success',
      iconColor: '#048B67',
      confirmButtonColor: '#073B4C',
      title: 'List successfully created!',
      text: `Your new token is "${token}"`,
    });
    history.push('/list');
  }

  function handleInputValue(e) {
    setInputValue(e.target.value);
  }

  function checkExistingToken(e) {
    e.preventDefault();
    if (!inputValue) {
      return Swal.fire({
        icon: 'error',
        iconColor: '#EF476F',
        title: 'Please enter your token.',
        text: 'Input is empty',
        confirmButtonColor: '#073B4C',
      });
    }
    db.collection(inputValue.trim())
      .get()
      .then((snap) => {
        if (snap.empty) {
          Swal.fire({
            icon: 'error',
            iconColor: '#EF476F',
            title: 'Token not found',
            text: 'Please try again or start a new list!',
            confirmButtonColor: '#073B4C',
          });
        } else {
          addKeyValuePairToLocalStorage('token', inputValue);
          props.setToken(inputValue);
          history.push('/list');
        }
      });
  }

  return (
    <main>
      <h1>Welcome To CLEVER NAME TO BE DETERMINED List!</h1>
      <p>
        CNTBD is here to add a little more organization to your grocery list. Or
        lists!
      </p>
      <p>To start, either:</p>
      <h2>Create a brand new list</h2>
      <Button onClick={handleClick} text="Start a new list" />
      <p>Or</p>

      <h2>Enter a 3 word token to access an already existing list.</h2>
      <form onSubmit={checkExistingToken}>
        <label htmlFor="token">
          Please Enter Token:
          <input
            type="text"
            name="token"
            placeholder="Three word token"
            value={inputValue}
            onChange={handleInputValue}
          />
          <IconButton
            type="submit"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            }
            label="submit token"
          />
        </label>
      </form>
    </main>
  );
}
