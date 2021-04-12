import { useState } from 'react';
import { db } from '../lib/firebase';
// import { useCollection } from 'react-firebase-hooks/firestore';

export default function AddItem(props) {
  const [itemName, setItemName] = useState('');
  const [purchaseFrequency, setPurchaseFrequency] = useState(null);
  const [lastPurchased, setLastPurchased] = useState(null);

  const handleName = (e) => {
    setItemName(e.target.value);
  };

  const handleFrequency = (e) => {
    setPurchaseFrequency(e.target.value);
  };

  const createListItem = () => {
    db.collection('list')
      .doc('user_1')
      .collection('shopping_items')
      .add({
        item_name: itemName,
        purchase_frequency: purchaseFrequency,
        last_purchased: lastPurchased,
      })
      .then((documentReference) => {
        console.log('document reference ID', documentReference.id);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <h1>Add Item</h1>
      <form onSubmit={() => createListItem()}>
        <label>
          Item Name
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            onChange={(e) => handleName(e)}
          />
        </label>
        <br />
        <label>
          Purchase Frequency
          <select value={purchaseFrequency} onBlur={handleFrequency}>
            <option value={7}>7 Days</option>
            <option value={14}>14 Days</option>
            <option value={30}>30 Days</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </>
  );
}
