import { checkForToken, addTokenToLocalStorage } from '../lib/localStorage';
import { useHistory } from 'react-router-dom';

export default function Home() {
  const isThereToken = checkForToken('token', '');
  const history = useHistory();

  function handleClick() {
    addTokenToLocalStorage('token');
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
