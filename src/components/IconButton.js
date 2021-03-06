export default function IconButton({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 text-midnight-green px-2 rounded font-medium py-0 ml-2 hover:bg-caribbean-green"
    >
      <span role="img" aria-label={label}>
        {icon}
      </span>
    </button>
  );
}
