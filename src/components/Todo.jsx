import React, { useState } from "react";

import { db } from "../firebase";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";

const style = {
  li: `justify-between bg-slate-200 p-1 my-2 capitalize`,
  liNear: `justify-between bg-slate-200 p-1 my-2 capitalize`,
  liFar: `justify-between bg-slate-200 p-1 my-2 capitalize`,
  liComplete: `justify-between bg-slate-400 p-1 my-2 capitalize`,
  name: `justify-between bg-slate-200 p-1 capitalize`,
  nameComplete: `justify-between bg-slate-400 p-1 capitalize`,
  row: `flex text-center`,
  text: `ml-2 cursor-pointer`,
  textComplete: `ml-2 cursor-pointer line-through`,
  input: `border p-1 w-full rounded-md`,
  button: `border p-1 w-full rounded-md bg-blue-400`,
  close: `border p-1 w-full rounded-md bg-red-400`,
};

const Todo = ({ todo }) => {
  const [showForm, setShowForm] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  // Mark todo as completed
  const toggleComplete = async (id) => {
    const todoSnapshot = await getDoc(doc(db, "todos", id));
    const todoData = todoSnapshot.data();

    const completed = !todoData.completed;
    const end = completed ? Date.now() : null;
    const start = todoData.start;
    const time = completed ? end - todoData.start : null;

    await updateDoc(doc(db, "todos", id), {
      completed: completed,
      end: completed ? Date.now() : null,
      start: start,
      time: time,
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
                <option value="0">Change priority...</option>
                <option value="3">Low</option>
                <option value="2">Medium</option>
                <option value="1">High</option>
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
                <button className={style.button}>Save</button>
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
          <div className="grid grid-cols-4 gap-4">
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
            <div className="text-center">{todo.priority}</div>
            <div className="text-center">
              {todo.dueDate ? todo.dueDate : ""}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-right pr-4">
                <button class={style.icon} onClick={() => setShowForm(true)}>
                  Edit
                </button>
              </div>
              <div>
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
