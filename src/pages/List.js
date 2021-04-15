import { checkLocalStorageForKey } from '../lib/localStorage';
import { useHistory } from 'react-router-dom';

export default function List(props) {
  const isThereToken = checkLocalStorageForKey('token', '');
  const history = useHistory();
  return (
    <>
      {isThereToken ? '' : history.push('/')}
      <h1>THIS IS THE LIST</h1>
    </>
  );
}
