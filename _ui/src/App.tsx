import { useState } from "react";
import Navbar from "./components/Navbar";
import TodoComponent from "./components/Todo/TodoComponent";
import Timer from "./components/Pomodoro/Timer";

function App() {
  const [page, setPage] = useState("home");

  const navigate = (pageName: string) => {
    setPage(pageName);
  };

  return (
    <div className="bg-slate-950 text-zinc-50  min-h-[100vh]">
      <div className="border-b border-white pl-2 pt-2 h-[2.5em]">
        <Navbar onClick={navigate} />
      </div>
      {page === "home" ? null : page === "todo" ? (
        <TodoComponent />
      ) : page === "pomo" ? ( // <PomoComponent />
        <Timer />
      ) : null}
    </div>
  );
}

export default App;
