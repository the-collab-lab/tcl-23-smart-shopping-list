//https://github.com/kjmczk/react-hooks-firebase/blob/master/src/components/BookForm.js
//https://medium.com/technest/how-to-connect-firebase-cloud-firestore-to-your-react-app-1118fd182c60

import React, { useState } from 'react';

import { db } from '../lib/firebase';

const SubmissionForm = () => {
  const [item, setItem] = useState({
    item: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    db.collection('groceries').add(item);
    setItem({
      item: '',
      description: '',
    });
  };

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h6>This Week's List Entry:</h6>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="item"
            name="item"
            value={item.item}
            onChange={handleChange}
            placeholder="e.g. eggs, milk"
            className="validate"
            required
          />
          <label htmlFor="item">Item</label>
        </div>
        <div>
          <input
            type="text"
            id="description"
            name="description"
            value={item.description}
            onChange={handleChange}
            placeholder="for paella recipe"
            className="validate"
            required
          />
          <label htmlFor="description">Description</label>
        </div>
        <div>
          <button type="submit">Add Item</button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;
