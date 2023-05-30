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
  if (dateInt === 0) {
    return "0";
  }
  const dateString = dateInt.toString();
  const dateList = dateString.split("");
  const year = `${dateList[0]}${dateList[1]}${dateList[2]}${dateList[3]}`;
  const month = `${dateList[4]}${dateList[5]}`;
  const day = `${dateList[6]}${dateList[7]}`;
  return `${year} - ${month} - ${day}`;
};

function App() {
  const [todos, setTodos] = useState([]);

  // Used for sorting
  const [sortByPriority, setSortByPriority] = useState(false);
  const [sortByDate, setSortByDate] = useState(false);

  // URL
  const baseUrl = "http://localhost:9090/todos";

  // Used for the filtering
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

  const calculateAverageTime = (pty) => {
    // Filter out the tasks that are not completed
    let completedTasks = todos.filter((task) => task.completed);

    // Keep only the tasks that match pty given.
    if (pty === "Low") {
      completedTasks = completedTasks.filter((task) => task.priority === "low");
    } else if (pty === "Medium") {
      completedTasks = completedTasks.filter(
        (task) => task.priority === "medium"
      );
    } else if (pty === "High") {
      completedTasks = completedTasks.filter(
        (task) => task.priority === "high"
      );
    }

    const times = completedTasks.map((task) => task.endDate - task.startDate);

    if (times.length === 0) {
      return "N/A";
    }

    const sum = times.reduce((acc, time) => acc + time, 0);
    const averageSeconds = Math.round(sum / times.length);
    const minutes = Math.floor(averageSeconds / 60);
    const seconds = averageSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  const averageTimeAll = calculateAverageTime("None");
  const averageTimeLow = calculateAverageTime("Low");
  const averageTimeMedium = calculateAverageTime("Medium");
  const averageTimeHigh = calculateAverageTime("High");

  // Read todos from backend on load...
  useEffect(() => {
    fetchTodos();
    // ...and whenever the sorting state changes
  }, [sortByPriority, sortByDate]);

  // GET todos from backend
  const fetchTodos = async () => {
    const params = new URLSearchParams();

    if (sortByPriority) {
      params.append("sort", "priority");
    } else if (sortByDate) {
      params.append("sort", "due");
    }

    if (qstatus !== "") {
      params.append("filterCompleted", qstatus);
    }

    if (qpriority !== "") {
      params.append("filterPriority", qpriority);
    }

    if (qkeywords !== "") {
      params.append("keywords", qkeywords);
    }

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

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
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
    }
  };

  // Used to trigger fetchTodos from other files
  const handleButtonClick = () => {
    fetchTodos();
  };

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h1 className={style.heading} data-testid="todo-title">
          To Do App
        </h1>
        <Search
          qkeywords={qkeywords}
          setQKeywords={setQKeywords}
          qpriority={qpriority}
          setQPriority={setQPriority}
          qstatus={qstatus}
          setQStatus={setQStatus}
          onClickButton={handleButtonClick}
        />
        <AddTodo onClickButton={handleButtonClick} />
        <div className="grid grid-cols-4">
          <div className={style.todohead}>
            <strong>Task</strong>
          </div>
          <div
            className={style.todohead}
            onClick={() => {
              setSortByPriority(true);
              setSortByDate(false);
              fetchTodos();
            }}
            style={{ cursor: "pointer" }}>
            <strong>Priority ↕️</strong>
          </div>
          <div
            className={style.todohead}
            onClick={() => {
              setSortByPriority(false);
              setSortByDate(true);
              fetchTodos();
            }}
            style={{ cursor: "pointer" }}>
            <strong>Due ↕️</strong>
          </div>
          <div className={style.todohead}>
            <strong>Actions</strong>
          </div>
        </div>
        <div>
          {todos.slice(startDisplay, endDisplay).map((todo, index) => (
            <Todo key={index} todo={todo} onClickButton={handleButtonClick} />
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
