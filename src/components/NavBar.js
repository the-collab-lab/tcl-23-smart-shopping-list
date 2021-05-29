import { NavLink as RouterLink } from 'react-router-dom';

export default function NavBar(props) {
  return (
    <nav className="grid grid-cols-2 bg-blue-ncs p-5 text-lg md:text-xl w-full divide-x-2 divide-gray-200 fixed bottom-0 z-10 md:px-36 lg:px-48 xl:px-72 lg:w-2/3">
      <RouterLink
        className="hover:text-orange-yellow"
        exact
        activeClassName="text-orange-yellow"
        to="/list"
      >
        <span
          role="img"
          aria-label="Your List"
          className="flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 md:h-6 md:w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          Your List
        </span>
      </RouterLink>
      <RouterLink
        className="hover:text-orange-yellow"
        exact
        activeClassName="text-orange-yellow"
        to="/add-item"
      >
        <span
          role="img"
          aria-label="Add Item"
          className="flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 md:h-6 md:w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Add Item
        </span>
      </RouterLink>
    </nav>
  );
}
