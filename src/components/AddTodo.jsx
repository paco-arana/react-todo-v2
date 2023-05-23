import React, { useState } from "react";

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const style = {
  input: `border p-2 w-full rounded-md`,
  button: `border p-2 w-full rounded-md bg-blue-400`,
  close: `border p-2 w-full rounded-md bg-red-400`,
  background: `z-40 fixed top-0 left-0 h-full w-screen bg-opacity-75 bg-slate-400`,
  form: `z-50 relative`,
};

const AddTodo = () => {
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");

  //  Create todo
  const createTodo = async (e) => {
    e.preventDefault(e);
    if (input === "") {
      alert("please enter a valid string");
      return;
    }
    await addDoc(collection(db, "todos"), {
      text: input,
      completed: false,
      due: dueDate, // Include the due date in the new todo
      priority: priority, // Include the priority in the new todo
      start: Date.now(),
    });
    setInput("");
    setDueDate(null);
    setShowForm(false);
    setPriority(""); // Reset priority state after adding the todo
  };

  return (
    <div>
      {showForm ? (
        <div>
          <div className={style.background}></div>
          <form onSubmit={createTodo} className={style.form}>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={style.input}
                  type="text"
                  placeholder="Add new..."
                />
              </div>
              <div>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  id="priorityInput"
                  className={style.input}
                  placeholder="Select priority">
                  <option value="">Select priority...</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={style.input}
                  type="date"
                  placeholder="Due date..."
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
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <div>
            <button className={style.button} onClick={() => setShowForm(true)}>
              + Add New To Do
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTodo;
