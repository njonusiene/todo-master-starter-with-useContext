import { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TodosContext from "../contexts/TodosContext";

const ListItem = ({ item, itemAnimation }) => {
  const { setListData } = useContext(TodosContext);
  const [editMode, setEditMode] = useState(false);
  const [itemText, setItemText] = useState(item.title);
  const inputRef = useRef(null);

  const handleRemove = async () => {
    const resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${item.id}`, {
      method: 'DELETE',
    });

    if (resp.ok) {
      const newListData = (await resp.json()) || [];
      setListData(newListData);
    } else {
      console.error('Failed to remove item');
    }
  };
  
  const updateTextAPI = async (itemId, text) => {
    const resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: text,
      }),
    });

    if (resp.ok) {
      const updatedItem = await resp.json();
      return updatedItem;
    } else {
      console.error('Failed to update item');
    }
  };
  
  const handleEdit = async () => {
    if (editMode) {
      const updatedItem = await updateTextAPI(item.id, itemText);

      if (updatedItem) {
        const updatedListData = (await setListData((prevValues) =>
          prevValues.map((data) => (data.id === updatedItem.id ? updatedItem : data))
        )) || [];
        setEditMode(false);
      }
    } else {
      setEditMode(!editMode);
    }
  };
  

  const handleChange = (e) => {
    setItemText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEdit();
    }
  };

  useEffect(() => {
    if (editMode) {
      inputRef.current.focus();
    }
  }, [editMode]);

  return (
    <motion.li className="list-item" variants={itemAnimation} layout="position">
      <div className={editMode ? "text hidden" : "text"}>{itemText}</div>
      <textarea
        ref={inputRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={editMode ? "" : "hidden"}
        type="text"
        value={itemText}
      />
      <div className="buttons">
      <button className="edit" onClick={() => handleEdit()}>
          <i className="fa-solid fa-edit"></i>
        </button>

        <button className="remove" onClick={handleRemove}>
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </motion.li>
  )
}

export default ListItem;