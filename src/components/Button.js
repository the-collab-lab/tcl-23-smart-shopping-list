export default function Button({ onClick, tailwind, text }) {
  return (
    <button
      onClick={onClick}
      className={`bg-orange-yellow text-midnight-green rounded p-2 text-lg ${tailwind}`}
    >
      {text}
    </button>
  );
}
