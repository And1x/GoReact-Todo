import TodoList from "./TodoList";
import NewTodo from "./NewTodo";
import Sidebar, { Categories } from "./CategorySidebar";
import { useState } from "react";

interface Props {
  handleGoToPomo: (itemTitle: string, itemID: number) => void;
}

export default function TodoComponent({ handleGoToPomo }: Props) {
  const [showNew, setShowNew] = useState(false);
  function disableShowNew() {
    setShowNew(false);
  }

  const [cat, setCat] = useState(Categories.all);
  function switchCategory(cat: string) {
    setCat(cat);
    setShowNew(false);
  }

  return (
    <div className="text-zinc-50 font-mono">
      <div className="flex flex-row gap-3">
        <Sidebar categories={Categories} onSelect={switchCategory} />
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
            <TodoList filter={cat} handleGoToPomo={handleGoToPomo} />
          )}
        </div>
      </div>
    </div>
  );
}
