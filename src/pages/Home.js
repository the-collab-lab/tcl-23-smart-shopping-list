import {
  checkLocalStorageForKey,
  addKeyValuePairToLocalStorage,
} from '../lib/localStorage';
import getToken from '../lib/tokens';
import { useHistory } from 'react-router-dom';

export default function Home(props) {
  const retrievedToken = checkLocalStorageForKey('token', '');
  const history = useHistory();

  function handleClick() {
    const token = getToken();
    addKeyValuePairToLocalStorage('token', token);
    props.setToken(token);
    history.push('/list');
  }

  return (
    <main>
      {retrievedToken ? history.push('/list') : ''}
      <h1>Welcome screen</h1>
      <button onClick={handleClick}>Add List</button>
    </main>
  );
}
