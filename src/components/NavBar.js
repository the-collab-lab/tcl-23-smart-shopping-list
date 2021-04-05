import { Link as RouterLink } from 'react-router-dom';

export default function NavBar(props) {
  return (
    <nav>
      <RouterLink to="/">
        <button>List</button>
      </RouterLink>

      <RouterLink to="/add-item">
        <button>Add item</button>
      </RouterLink>
    </nav>
  );
}
