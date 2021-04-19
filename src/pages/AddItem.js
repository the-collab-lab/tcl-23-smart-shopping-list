import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

export default function AddItem(props) {
  const [itemName, setItemName] = useState('');
  const [purchaseFrequency, setPurchaseFrequency] = useState(null);
  const [lastPurchased, setLastPurchased] = useState(null);
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    // do we need a check for loading if grabbing firestore data takes too long
    // possibly use the 'loading' property from useCollection
    const itemData = db
      .collection('generated_token')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data());
        });
      });

    setListItems(itemData);
    console.log(itemData);
  }, []);

  const handleNameChange = (e) => {
    setItemName(e.target.value);
  };

  const handleFrequencyChange = (e) => {
    setPurchaseFrequency(e.target.value);
  };

  const checkForDuplicates = () => {
    return false;
  };

  async function createListItem(e) {
    e.preventDefault();
    try {
      const result = await checkForDuplicates(itemName);
      if (result) {
        db.collection('generated_token')
          .add({
            item_name: itemName,
            purchase_frequency: parseInt(purchaseFrequency),
            last_purchased: lastPurchased,
          })
          .then((documentReference) => {
            console.log('document reference ID', documentReference.id);
          })
          .catch((error) => {
            console.log(error.message);
          });
        setItemName('');
        setLastPurchased(null);
        // setListItems(...listItems, newestItem);
      }
    } catch (err) {
      alert('using SweetAlert for this');
    }
  }

  return (
    <>
      <h1>Add Item</h1>
      <form onSubmit={createListItem}>
        <label htmlFor="itemName">
          Item Name
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={itemName}
            onChange={handleNameChange}
          />
        </label>
        <br />
        <label>
          Purchase Frequency
          <select onBlur={handleFrequencyChange}>
            <option value={7}>Soon</option>
            <option value={14}>Kind of Soon</option>
            <option value={30}>Not Soon</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </>
  );
}
