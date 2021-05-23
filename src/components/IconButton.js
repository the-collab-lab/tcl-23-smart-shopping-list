export default function IconButton({ onClick, tailwind, text }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-200 text-midnight-green px-2 rounded font-medium py-0 ml-2 hover:bg-blue-ncs ${tailwind}`}
    >
      {text}
    </button>
  );
}
