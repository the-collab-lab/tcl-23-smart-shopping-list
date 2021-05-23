export default function Button(text, styles) {
  return (
    <button
      className={`bg-orange-yellow text-midnight-green rounded p-2 text-lg ${styles}`}
    >
      {text}
    </button>
  );
}
