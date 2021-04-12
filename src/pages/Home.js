import { checkLocalStorage } from '../lib/localStorage';

checkLocalStorage('token', 'abc');
console.log(checkLocalStorage('token', 'abc'));

export default function Home() {
  return (
    <div>
      <h1>Welcome screen</h1>
      <button>Add List</button>
    </div>
  );
}
