import { db } from '../lib/firebase';

export default function List({ listItems, error, loading, token }) {
  const markItemPurchased = (e, id) => {
    const elapsedMilliseconds = Date.now();

    if (e.target.checked === true) {
      db.collection(token).doc(id).update({
        last_purchased: elapsedMilliseconds,
      });
    }
  };

  function compareTimeStamps(lastPurchased) {
    const currentElapsedMilliseconds = Date.now();
    const millisecondsInOneDay = 86400000;
    return currentElapsedMilliseconds - lastPurchased < millisecondsInOneDay;
  }

  return (
    <>
      <h1>Your token: {token}</h1>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      {listItems && (
        <>
          <span>Your Shopping List:</span>
          <ul>
            {listItems.docs.map((doc) => (
              <li key={doc.id} className="checkbox-wrapper">
                <label>
                  <input
                    type="checkbox"
                    defaultChecked={compareTimeStamps(
                      doc.data().last_purchased,
                    )}
                    onClick={(e) => markItemPurchased(e, doc.id)}
                  />
                  {doc.data().item_name}
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
