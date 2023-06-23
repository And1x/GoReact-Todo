import "./App.css";
import TodoList from "./components/TodoList";
import NewTodo from "./components/NewTodo";
import { useState } from "react";

function App() {
  const [showNew, setShowNew] = useState(false);
  function disableShowNew() {
    setShowNew(false);
  }
  return (
    <div className="flex flex-col bg-slate-900 text-zinc-50 font-mono min-h-[100vh] p-5">
      <h1 className="text-3xl text-center mb-6">Go React</h1>
      <button
        className="bg-slate-700 hover:text-emerald-400 w-fit rounded p-1 my-4 self-center"
        onClick={() => setShowNew(true)}
      >
        NEW TODO
      </button>
      <div className="self-center">
        {showNew ? <NewTodo disableNew={disableShowNew} /> : <TodoList />}
      </div>
    </div>
  );
}

export default App;
