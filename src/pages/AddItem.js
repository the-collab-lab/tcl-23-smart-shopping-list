import { useState } from 'react';
import { db } from '../lib/firebase';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';

export default function AddItem(props) {
  const [itemName, setItemName] = useState('');
  const [purchaseFrequency, setPurchaseFrequency] = useState(7);
  const [lastPurchased] = useState(null);

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

    const matchingItemName = props.listItems.filter((item) => {
      const normalizedDatabaseItem = normalizeString(item.item_name);

      return normalizedDatabaseItem === normalizedUserInput;
    });

    return matchingItemName.length !== 0;
  };

  function createListItem(e) {
    e.preventDefault();

    const newItemObject = {
      item_name: itemName,
      purchase_frequency: parseInt(purchaseFrequency),
      last_purchased: lastPurchased,
    };

    const itemExists = doesItemExistInDatabase(itemName);

    if (itemExists) {
      swal(
        'OH GOSH!',
        `${normalizeString(itemName).toUpperCase()} is already in your list`,
        'error',
      );
    } else if (!itemName) {
      swal('UH OH!', "Item name can't be blank", 'warning');
    } else {
      db.collection(props.token).add(newItemObject);
      props.setListItems((prev) => [...prev, newItemObject]);
      history.push('/list');
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
