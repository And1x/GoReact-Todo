import "./App.css";
import TodoList from "./components/TodoList";
import NewTodo from "./components/NewTodo";
import Sidebar, { dueDateCategories } from "./components/CategorySidebar";
import { useState } from "react";

function App() {
  const [showNew, setShowNew] = useState(false);
  function disableShowNew() {
    setShowNew(false);
  }

  const [dueDateCat, setDueDateCat] = useState(dueDateCategories.all);
  function switchCategory(cat: string) {
    setDueDateCat(cat);
    setShowNew(false);
  }

  return (
    <div className="bg-slate-900 text-zinc-50 font-mono min-h-[100vh]">
      <div className="flex flex-row gap-3">
        <Sidebar categories={dueDateCategories} onSelect={switchCategory} />
        <div className="flex flex-col w-full">
          <h1 className="my-4 text-6xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-800">
            GoToDo
          </h1>
          <button
            className="bg-slate-700 hover:text-emerald-400 font-semibold w-fit rounded p-1 my-4 self-center"
            onClick={() => setShowNew(true)}
          >
            NEW TODO
          </button>
          {showNew ? (
            <NewTodo disableNew={disableShowNew} />
          ) : (
            <TodoList filter={dueDateCat} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
