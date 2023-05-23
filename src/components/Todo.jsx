import React, { useState } from "react";

import { db } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const style = {
  li: `justify-between bg-slate-200 p-2 my-2 capitalize`,
  liComplete: `justify-between bg-slate-400 p-2 my-2 capitalize`,
  name: `justify-between bg-slate-200 p-2 capitalize`,
  nameComplete: `justify-between bg-slate-400 p-2 capitalize`,
  row: `flex text-center`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  input: `border p-2 w-full rounded-md`,
  button: `border p-2 w-full rounded-md bg-blue-400`,
  close: `border p-2 w-full rounded-md bg-red-400`,
};

const Todo = ({ todo }) => {
  const [showForm, setShowForm] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  // Mark todo as completed
  const toggleComplete = async (id) => {
    await updateDoc(doc(db, "todos", id), {
      completed: !todo.completed,
      end: todo.completed ? Date.now() : null,
      time: todo.completed ? Date.now() - todo.start : null,
    });
  };

  // Edit todo
  const editTodo = async (id, e) => {
    e.preventDefault(e);
    await updateDoc(doc(db, "todos", id), {
      priority: newPriority,
      due: newDueDate,
    });
    setShowForm(false);
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  return (
    <div>
      {showForm ? (
        <form onSubmit={(e) => editTodo(todo.id, e)} className={style.form}>
          <div className="grid grid-cols-4 gap-4">
            <div className={todo.completed ? style.nameComplete : style.name}>
              <div className={style.row}>
                <input
                  onChange={() => toggleComplete(todo.id)}
                  type="checkbox"
                  checked={todo.completed ? "checked" : ""}
                />
                <p
                  onClick={() => toggleComplete(todo.id)}
                  className={todo.completed ? style.textComplete : style.text}>
                  {todo.text}
                </p>
              </div>
            </div>
            <div>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                id="priorityInput"
                className={style.input}
                placeholder="Select priority">
                <option value="">Change priority...</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <input
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className={style.input}
                type="date"
                defaultValue={null}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <button className={style.button}>Add</button>
              </div>
              <div>
                <button
                  className={style.close}
                  onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className={todo.completed ? style.liComplete : style.li}>
          <div className="grid grid-cols-5 gap-4">
            <div className={style.row}>
              <input
                onChange={() => toggleComplete(todo.id)}
                type="checkbox"
                checked={todo.completed ? "checked" : ""}
              />
              <p
                onClick={() => toggleComplete(todo.id)}
                className={todo.completed ? style.textComplete : style.text}>
                {todo.text}
              </p>
            </div>
            <div className="text-center">
              {todo.priority ? todo.priority : ""}
            </div>
            <div className="text-center">{todo.due ? todo.due : ""}</div>
            <div className="text-center">{todo.completed ? todo.time : ""}</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <button class={style.icon} onClick={() => setShowForm(true)}>
                  Edit
                </button>
              </div>
              <div className="text-center">
                <button class={style.icon} onClick={() => deleteTodo(todo.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
