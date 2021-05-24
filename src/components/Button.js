export default function Button({ onClick, text }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-orange-yellow text-midnight-green rounded p-2 text-lg font-medium hover:bg-caribbean-green"
    >
      {text}
    </button>
  );
}
