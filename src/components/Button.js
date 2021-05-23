export default function Button({ onClick, tailwind, text }) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-orange-yellow text-midnight-green rounded p-2 text-lg font-medium hover:bg-blue-ncs ${tailwind}`}
    >
      {text}
    </button>
  );
}
