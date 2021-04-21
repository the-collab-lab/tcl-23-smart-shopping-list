import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';

export default function AddItem(props) {
  const [itemName, setItemName] = useState('');
  const [purchaseFrequency, setPurchaseFrequency] = useState(7);
  const [lastPurchased, setLastPurchased] = useState(null);
  const [listItems, setListItems] = useState([]);

  const history = useHistory();

  useEffect(() => {
    // do we need a check for loading if grabbing firestore data takes too long
    // possibly use the 'loading' property from useCollection
    db.collection('generated_token')
      .get()
      .then((querySnapshot) => {
        const listItemData = [];

        querySnapshot.forEach((doc) => {
          listItemData.push(doc.data());
        });
        setListItems(listItemData);
      });
  }, []);

  const handleNameChange = (e) => {
    setItemName(e.target.value);
  };

  const handleFrequencyChange = (e) => {
    setPurchaseFrequency(e.target.value);
  };

  const checkForDuplicates = () => {
    // we would like to potentially normalize white space but unsuccessfull so far
    const normalizedUserInput = itemName
      .toLowerCase()
      .replace(/[^\w\s]|_/g, '');

    const matchingItemName = listItems.filter((item) => {
      const normalizedDatabaseItem = item.item_name
        .toLowerCase()
        .replace(/[^\w\s]|_/g, '');
      console.log(normalizedDatabaseItem);
      return normalizedDatabaseItem === normalizedUserInput;
    });

    if (matchingItemName.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  async function createListItem(e) {
    e.preventDefault();
    try {
      const result = await checkForDuplicates(itemName);
      console.log(result);
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
            // alert('Item already exists!');
          });
        setItemName('');
        setLastPurchased(null);
        history.push('/list');
      } else {
        swal(
          'OH GOSH!',
          `${itemName
            .toUpperCase()
            .replace(/[^\w\s]|_/g, '')} is already in your list`,
          'error',
        );
        // alert('Item already exists!');
      }
    } catch (err) {
      // alert('using SweetAlert for this');
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
