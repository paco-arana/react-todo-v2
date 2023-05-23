import React from "react";

const style = {
  input: `border p-2 w-full rounded-md`,
  button: `border p-2 w-full rounded-md bg-blue-400`,
  form: `mb-4`,
};

const Search = ({
  qkeywords,
  setQKeywords,
  qpriority,
  setQPriority,
  qstatus,
  setQStatus,
  searchTodos,
}) => {
  return (
    <form onSubmit={searchTodos} className={style.form}>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <input
            value={qkeywords}
            onChange={(e) => setQKeywords(e.target.value)}
            className={style.input}
            type="text"
            placeholder="Add keywords..."
          />
        </div>
        <div>
          <select
            value={qpriority}
            onChange={(e) => setQPriority(e.target.value)}
            id="priorityInput"
            className={style.input}
            placeholder="All priorities...">
            <option value="">All priorities...</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <select
            value={qstatus}
            onChange={(e) => setQStatus(e.target.value)}
            id="priorityInput"
            className={style.input}
            placeholder="Select priority">
            <option value="">All States...</option>
            <option value="true">Done</option>
            <option value="false">Undone</option>
          </select>
        </div>
        <div>
          <button className={style.button}>🔍 Search</button>
        </div>
      </div>
    </form>
  );
};

export default Search;
