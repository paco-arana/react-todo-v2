import React, { useState, useEffect } from "react";

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

// Helper function convert date string to int
const convertDate = (dateString) => {
  const dateWithoutDashes = dateString.replace(/-/g, "");
  return parseInt(dateWithoutDashes, 10);
};

// Helper function to convert label back to int
const getPriority = (priority) => {
  if (priority === "high") {
    return 1;
  } else if (priority === "medium") {
    return 2;
  } else if (priority === "low") {
    return 3;
  }
};

const Todo = ({ todo, onClickButton }) => {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPriority, setNewPriority] = useState(3);
  const [newDueDate, setNewDueDate] = useState("0");

  useEffect(() => {
    setNewName(todo.text);
    setNewPriority(getPriority(todo.priority));
    setNewDueDate("0");
  }, [todo]);

  // Used to trigger fetchTodos after modifying a todo is added
  const handleButtonClick = () => {
    onClickButton();
  };

  // Mark todo as completed
  const toggleComplete = async (e, id) => {
    e.preventDefault();
    let url = `http://localhost:9090/todos`;
    const requestBody = {
      id: id,
    };

    // Decide if we should mark as done or undone
    if (todo.completed === true) {
      url += `/${id}/undone`;
    } else if (todo.completed === false) {
      url += `/${id}/done`;
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);

      handleButtonClick(); // Call handleButtonClick after the state is updated
    } catch (error) {
      console.error(error);
    }
  };

  // Edit todo
  const editTodo = async (id, e) => {
    e.preventDefault();
    let url = `http://localhost:9090/todos/${id}`;
    const requestBody = {
      text: newName,
      priority: parseInt(newPriority),
      dueDate: convertDate(newDueDate),
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);

      setShowForm(false);
      handleButtonClick(); // Call handleButtonClick after the state is updated
    } catch (error) {
      console.error(error);
    }
  };

  // Erase a Todo
  const deleteTodo = async (e, id) => {
    e.preventDefault();
    let url = `http://localhost:9090/todos/${id}`;
    const requestBody = {
      id: id,
    };

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);

      // Fetch updated todos
      handleButtonClick();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {showForm ? (
        <form onSubmit={(e) => editTodo(todo.id, e)} className={style.form}>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex">
              <div className={style.row}>
                <input
                  className="mx-3"
                  onChange={(e) => toggleComplete(e, todo.id)}
                  type="checkbox"
                  checked={todo.completed ? "checked" : ""}
                />
              </div>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={style.input}
                type="text"
                defaultValue={todo.text}
                placeholder={todo.text}
              />
            </div>
            <div>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                id="priorityInput"
                className={style.input}
                placeholder="Select priority">
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
                onChange={(e) => toggleComplete(e, todo.id)}
                type="checkbox"
                checked={todo.completed ? "checked" : ""}
                className="mx-2"
              />
              <p
                onClick={(e) => toggleComplete(e, todo.id)}
                className={todo.completed ? style.textComplete : style.text}>
                {todo.text}
              </p>
            </div>
            <div className="text-center">{todo.priority}</div>
            <div className="text-center">
              {todo.dueDate !== "0" ? todo.dueDate : "No due date"}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-right pr-4">
                <button
                  className={style.icon}
                  onClick={() => setShowForm(true)}>
                  Edit
                </button>
              </div>
              <div>
                <button
                  className={style.icon}
                  onClick={(e) => deleteTodo(e, todo.id)}>
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
