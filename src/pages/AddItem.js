import { useState } from 'react';
import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function AddItem(props) {
  const [itemName, setItemName] = useState('');
  const [purchaseFrequency, setPurchaseFrequency] = useState(null);
  const [lastPurchased, setLastPurchased] = useState(null);

  const handleName = (e) => {
    console.log(e.target.value);
    setItemName(e.target.value);
  };

  const createListItem = () => {
    db.collection('list')
      .doc('this_weeks_list')
      .collection('shopping_items')
      .add({ item_name: itemName, purchase_frequency: 7, last_purchased: null })
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
      <form onSubmit={createListItem()}>
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
          <select>
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
