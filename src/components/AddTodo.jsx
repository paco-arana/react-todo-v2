import React, { useState } from "react";

const style = {
  input: `border p-2 w-full rounded-md`,
  button: `border p-2 w-full rounded-md bg-blue-400`,
  close: `border p-2 w-full rounded-md bg-red-400`,
  background: `z-40 fixed top-0 left-0 h-full w-screen bg-opacity-75 bg-slate-400`,
  form: `z-50 relative`,
};

// Helper function convert date string to int
const convertDate = (dateString) => {
  if (dateString === null || dateString === undefined || dateString === "0") {
    return 0; // or any other default value you prefer
  }
  const dateWithoutDashes = dateString.replace(/-/g, "");
  return parseInt(dateWithoutDashes, 10);
};

const AddTodo = ({ onClickButton }) => {
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState(3);
  const [dueDate, setDueDate] = useState("0");

  // Used to refresh Todos after every todo is added
  const handleButtonClick = () => {
    onClickButton();
  };

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault();

    const url = "http://localhost:9090/todos";
    const requestBody = {
      text: input,
      priority: parseInt(priority),
      dueDate: convertDate(dueDate),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);

      setInput("");
      setDueDate("0");
      setShowForm(false);
      setPriority(3);

      handleButtonClick(); // Call handleButtonClick after the state is updated
    } catch (error) {
      console.error(error);
    }
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
                  placeholder="Select priority...">
                  <option value="3">Low Priority</option>
                  <option value="2">Medium Priority</option>
                  <option value="1">High Priority</option>
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
