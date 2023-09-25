import { useState } from "react";
import Navbar from "./components/Navbar";
import TodoComponent from "./components/Todo/TodoComponent";

function App() {
  const [page, setPage] = useState("home");

  const navigate = (pageName: string) => {
    setPage(pageName);
  };

  return (
    <div className="bg-slate-900 text-zinc-50 font-mono min-h-[100vh]">
      <div className="border-b border-white pl-2 pt-2">
        <Navbar onClick={navigate} />
      </div>
      {page === "home" ? null : page === "todo" ? (
        <TodoComponent />
      ) : page === "pomo" ? ( // <PomoComponent />
        <div>Pomo</div>
      ) : null}
      {/* <TodoComponent /> */}
      {/* todo:
      add Pomodoro component here
      with routing
      by stat eg.
      - Default page
      - Todo page
      - Pomodor page
       */}
    </div>
  );
}

export default App;
