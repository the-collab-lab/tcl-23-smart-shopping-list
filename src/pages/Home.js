import { checkLocalStorage, addLocalStorage } from '../lib/localStorage';
import { useHistory } from 'react-router-dom';

export default function Home() {
  const isThereToken = checkLocalStorage('token', '');
  const history = useHistory();

  return (
    <div>
      {isThereToken ? history.push('/list') : ''}
      <h1>Welcome screen</h1>
      <button>Add List</button>
    </div>
  );
}
