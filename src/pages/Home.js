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
      <h2>Add a new list:</h2>
      <button onClick={handleClick}>Add List</button>
      <h2>Join an existing list</h2>
      <form>
        <label>
          Please Insert Token:
          <input type="text" name="token" placeholder="Three word token" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </main>
  );
}
