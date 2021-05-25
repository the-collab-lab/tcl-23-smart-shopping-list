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
      <h1 className="mt-5 mb-10 text-3xl self-start font-light">
        Add New Item
      </h1>
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
        <h2 className="my-5 self-start text-xl font-light">
          When will you purchase it?
        </h2>

        <div className="flex items-center w-full mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mr-5 fill-current text-caribbean-green"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex items-center p-2 bg-gray-200 rounded w-full">
            <input
              type="radio"
              name="frequency"
              id="soon"
              value={7}
              className="h-5 w-5 mx-5"
              onChange={handleFrequencyChange}
            />
            <label htmlFor="soon" className="text-midnight-green text-xl">
              Soon
            </label>
          </div>
        </div>

        <div className="flex items-center w-full mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mr-5 fill-current text-orange-yellow"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex items-center p-2 bg-gray-200 rounded w-full">
            <input
              type="radio"
              name="frequency"
              id="soon"
              value={14}
              className="h-5 w-5 mx-5"
              onChange={handleFrequencyChange}
            />
            <label htmlFor="soon" className="text-midnight-green text-xl">
              Soonish
            </label>
          </div>
        </div>

        <div className="flex items-center w-full mb-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mr-5 fill-current text-paradise-pink"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex items-center p-2 bg-gray-200 rounded w-full">
            <input
              type="radio"
              name="frequency"
              id="soon"
              value={30}
              className="h-5 w-5 mx-5"
              onChange={handleFrequencyChange}
            />
            <label htmlFor="soon" className="text-midnight-green text-xl">
              Not soon
            </label>
          </div>
        </div>
        <Button type="submit" text="+ Add a new item" />
      </form>
    </>
  );
}
