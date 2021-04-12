import { db } from './lib/firebase';
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

  return <h1>This is the form</h1>;
}
