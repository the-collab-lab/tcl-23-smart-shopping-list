import { NavLink as RouterLink } from 'react-router-dom';

export default function NavBar(props) {
  return (
    <nav>
      <RouterLink
        className="nav-link"
        exact
        activeClassName="nav-link-bold"
        to="/"
      >
        List
      </RouterLink>

      <RouterLink
        className="nav-link"
        exact
        activeClassName="nav-link-bold"
        to="/add-item"
      >
        Add item
      </RouterLink>
    </nav>
  );
}
