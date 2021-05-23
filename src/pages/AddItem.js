import { useState } from 'react';
import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import Button from '../components/Button';

export default function AddItem({ token }) {
  const [itemName, setItemName] = useState('');
  const [purchaseFrequency, setPurchaseFrequency] = useState(7);

  const [listItems] = useCollection(db.collection(token), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const history = useHistory();

  const handleNameChange = (e) => {
    setItemName(e.target.value);
  };

  const handleFrequencyChange = (e) => {
    setPurchaseFrequency(e.target.value);
  };

  const normalizeString = (str) => {
    return str.toLowerCase().replace(/[^\w]|_|\s/g, '');
  };

  const doesItemExistInDatabase = () => {
    const normalizedUserInput = normalizeString(itemName);

    const matchingItemName = listItems.docs.filter((doc) => {
      const normalizedDatabaseItem = normalizeString(doc.data().item_name);

      return normalizedDatabaseItem === normalizedUserInput;
    });

    return matchingItemName.length !== 0;
  };

  function createListItem(e) {
    e.preventDefault();

    const newItemObject = {
      item_name: itemName,
      purchase_frequency: parseInt(purchaseFrequency),
      last_purchased: null,
      last_estimate: null,
      times_purchased: 0,
    };

    const itemExists = doesItemExistInDatabase(itemName);

    if (itemExists) {
      Swal.fire({
        title: 'OH GOSH!',
        text: `${normalizeString(
          itemName,
        ).toUpperCase()} is already in your list`,
        icon: 'error',
      });
    } else if (!itemName) {
      Swal.fire({
        title: 'UH OH!',
        text: "Item name can't be blank",
        icon: 'warning',
      });
    } else {
      db.collection(token).add(newItemObject);
      history.push('/list');
    }
  }

  return (
    <>
      <h1>Add Item</h1>
      <form
        onSubmit={createListItem}
        className="flex flex-col items-center w-full"
      >
        <label htmlFor="itemName" className="w-full">
          <input
            className="w-full pl-5 py-2 rounded bg-midnight-green border border-gray-200"
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
        <Button type="submit" text="+ Add a new item" />
      </form>
    </>
  );
}
