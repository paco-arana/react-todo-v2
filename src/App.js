import React, { useState, useEffect } from "react";

import Search from "./components/Search";
import AddTodo from "./components/AddTodo";
import Todo from "./components/Todo";

import { db } from "./firebase";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-t from-[dodgerblue] to-[deepskyblue]`,
  container: `bg-slate-100 w-10/12 m-auto rounded-md shadow-xl p-4`,
  heading: `text-2xl text-center mb-4`,
  todohead: `text-center mt-4 mb-4`,
};

function App() {
  const [todos, setTodos] = useState([]);
  const [qkeywords, setQKeywords] = useState("");
  const [qpriority, setQPriority] = useState("");
  const [qstatus, setQStatus] = useState("");

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
        <div className="grid grid-cols-5">
          <div className={style.todohead}>
            <strong>Task</strong>
          </div>
          <div className={style.todohead}>
            <strong>Priority ↕️</strong>
          </div>
          <div className={style.todohead}>
            <strong>Due ↕️</strong>
          </div>
          <div className={style.todohead}>
            <strong>Time</strong>
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
      </div>
    </div>
  );
}

export default App;
