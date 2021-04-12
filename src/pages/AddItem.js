import { db } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function AddItem(props) {
  const createListItem = () => {
    db.collection('list')
      .doc('this_weeks_list')
      .collection('shopping_items')
      .add({ item_name: 'banana', purchase_frequency: 7, last_purchased: null })
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
      <form>
        <label>
          Item Name
          <input type="text" name="name" placeholder="Item Name" />
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
