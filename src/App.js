import React, { useState, useEffect } from "react";

import Search from "./components/Search";
import AddTodo from "./components/AddTodo";
import Todo from "./components/Todo";

import { db } from "./firebase";
import { query, collection, onSnapshot } from "firebase/firestore";

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-b from-[dodgerblue] to-[white]`,
  container: `bg-opacity-75 bg-slate-100 w-10/12 m-auto rounded-md shadow-xl p-4 mb-4`,
  heading: `text-xl text-center mb-4`,
  todohead: `text-center mt-4 mb-4`,
  span: `ml-4`,
};

function App() {
  const [todos, setTodos] = useState([]);

  // Used for the filtering function
  const [qkeywords, setQKeywords] = useState("");
  const [qpriority, setQPriority] = useState("");
  const [qstatus, setQStatus] = useState("");

  // Used to paginate the Todos
  const handlePageClick = (num) => {
    const newStartDisplay = num * 10;
    const newEndDisplay = (num + 1) * 10;
    setStartDisplay(newStartDisplay);
    setEndDisplay(newEndDisplay);
  };
  const [startDisplay, setStartDisplay] = useState(0);
  const [endDisplay, setEndDisplay] = useState(10);

  // Used to calculate average times:
  const calculateAverageTime = (priority = "") => {
    // Filter according to priority, include all if priority not given
    const completedTodos = todos.filter(
      (todo) =>
        todo.completed && todo.time && (!priority || todo.priority === priority)
    );
    // Count to get average
    const completedCount = completedTodos.length;
    // Total in milliseconds
    const totalTime = completedTodos.reduce((sum, todo) => sum + todo.time, 0);
    // Average in milliseconds
    const averageTimeInMilliSeconds =
      completedCount > 0 ? totalTime / completedCount : 0;
    // 60,000 milliseconds in a minute
    const minutes = Math.floor(averageTimeInMilliSeconds / 60000);
    const seconds = Math.floor(averageTimeInMilliSeconds % 60);
    // Format in mm:ss and return
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  const averageTimeAll = calculateAverageTime();
  const averageTimeLow = calculateAverageTime("Low");
  const averageTimeMedium = calculateAverageTime("Medium");
  const averageTimeHigh = calculateAverageTime("High");

  // Read todos from firebase
  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe;
  }, []);

  // Search todos
  const searchTodos = (e) => {
    e.preventDefault();
    let filteredTodos = [...todos];

    // Filter by keywords
    if (qkeywords.trim() !== "") {
      filteredTodos = filteredTodos.filter((todo) =>
        todo.text.toLowerCase().includes(qkeywords.toLowerCase())
      );
    }

    // Filter by priority
    if (qpriority !== "") {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.priority === qpriority
      );
    }

    // Filter by state
    if (qstatus !== "") {
      if (qstatus === "true") {
        filteredTodos = filteredTodos.filter((todo) => todo.completed);
      } else if (qstatus === "false") {
        filteredTodos = filteredTodos.filter((todo) => !todo.completed);
      }
    }

    setTodos(filteredTodos);
  };

  // Sort todos by priority

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h1 className={style.heading}>To Do App</h1>
        <Search
          qkeywords={qkeywords}
          setQKeywords={setQKeywords}
          qpriority={qpriority}
          setQPriority={setQPriority}
          qstatus={qstatus}
          setQStatus={setQStatus}
          searchTodos={searchTodos}
        />
        <AddTodo />
        <div className="grid grid-cols-4">
          <div className={style.todohead}>
            <strong>Task</strong>
          </div>
          <div className={style.todohead} style={{ cursor: "pointer" }}>
            <strong>Priority ↕️</strong>
          </div>
          <div className={style.todohead} style={{ cursor: "pointer" }}>
            <strong>Due ↕️</strong>
          </div>
          <div className={style.todohead}>
            <strong>Actions</strong>
          </div>
        </div>
        <div>
          {todos.slice(startDisplay, endDisplay).map((todo, index) => (
            <Todo key={index} todo={todo} />
          ))}
        </div>

        <div className="text-center">
          <p>
            Pages:
            {[...Array(Math.ceil(todos.length / 10))].map((_, num) => (
              // I know this line above looks ugly but I coded it by trial and error and don't want to touch it
              <strong
                className={style.span}
                key={num}
                onClick={() => handlePageClick(num)}
                style={{ cursor: "pointer" }}>
                {num + 1}
              </strong>
            ))}
          </p>
        </div>
      </div>
      <div className={style.container}>
        <h1 className={style.heading}>Time to Finish Tasks</h1>
        <div className="grid grid-cols-4">
          <div className={style.todohead}>
            <strong>Average:</strong>
            <p>{averageTimeAll} min</p>
          </div>
          <div className={style.todohead}>
            <strong>Low Priority:</strong>
            <p>{averageTimeLow} min</p>
          </div>
          <div className={style.todohead}>
            <strong>Medium Priority:</strong>
            <p>{averageTimeMedium} min</p>
          </div>
          <div className={style.todohead}>
            <strong>High Priority:</strong>
            <p>{averageTimeHigh} min</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
