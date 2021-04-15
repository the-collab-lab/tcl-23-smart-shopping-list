import getToken from '../lib/tokens';
import {
  checkLocalStorageForKey,
  addKeyValuePairToLocalStorage,
} from '../lib/localStorage';
import { useHistory } from 'react-router-dom';

export default function Home({ setToken }) {
  const isThereToken = checkLocalStorageForKey('token', '');
  const history = useHistory();

  function handleClick() {
    const token = getToken();
    addKeyValuePairToLocalStorage('token', token);
    setToken(token);
    history.push('/list');
  }

  return (
    <main>
      {isThereToken ? history.push('/list') : ''}
      <h1>Welcome screen</h1>
      <button onClick={handleClick}>Add List</button>
    </main>
  );
}
