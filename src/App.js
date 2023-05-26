import React, { useState, useEffect } from "react";

import Search from "./components/Search";
import AddTodo from "./components/AddTodo";
import Todo from "./components/Todo";

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-b from-[dodgerblue] to-[white]`,
  container: `bg-opacity-75 bg-slate-100 w-10/12 m-auto rounded-md shadow-xl p-4 mb-4`,
  heading: `text-xl text-center mb-4`,
  todohead: `text-center mt-4 mb-4`,
  span: `ml-4`,
};

// Helper function to format the priority label
const getPriorityLabel = (priority) => {
  if (priority === 1) {
    return "high";
  } else if (priority === 2) {
    return "medium";
  } else if (priority === 3) {
    return "low";
  }
};

// Helper function to convert date to string format "YYYY-MM-DD"
const formatDate = (dateInt) => {
  const dateString = dateInt.toString();
  const dateList = dateString.split("");
  const year = `${dateList[0]}${dateList[1]}${dateList[2]}${dateList[3]}`;
  const month = `${dateList[4]}${dateList[5]}`;
  const day = `${dateList[6]}${dateList[7]}`;
  return `${year} - ${month} - ${day}`;
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
  const calculateAverageTime = (priority = "") => {};
  const averageTimeAll = calculateAverageTime();
  const averageTimeLow = calculateAverageTime("Low");
  const averageTimeMedium = calculateAverageTime("Medium");
  const averageTimeHigh = calculateAverageTime("High");

  // Read todos from firebase
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch("http://localhost:9090/todos")
      .then((response) => response.json())
      .then((data) => {
        // Map the fetched data to the required format
        const todos = data.map((task) => ({
          id: task.id,
          completed: task.completed,
          text: task.text,
          priority: getPriorityLabel(task.priority),
          dueDate: formatDate(task.dueDate),
          startDate: task.startDate,
          endDate: task.endDate,
        }));

        // Update the todos state with the parsed data
        setTodos(todos);
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });
  };

  // Used to trigger fetchTodos from other files
  const handleButtonClick = () => {
    fetchTodos();
  };

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
        />
        <AddTodo onClickButton={handleButtonClick} />
        <div className="grid grid-cols-4">
          <div className={style.todohead}>
            <strong>Task</strong>
          </div>
          <div
            className={style.todohead}
            onClick={fetchTodos}
            style={{ cursor: "pointer" }}>
            <strong>Priority ↕️</strong>
          </div>
          <div
            className={style.todohead}
            onClick={fetchTodos}
            style={{ cursor: "pointer" }}>
            <strong>Due ↕️</strong>
          </div>
          <div className={style.todohead}>
            <strong>Actions</strong>
          </div>
        </div>
        <div>
          {todos.map((todo, index) => (
            <Todo key={index} todo={todo} />
          ))}
        </div>
        <div className="text-center"></div>
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
