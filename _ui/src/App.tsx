import { useState } from "react";
import Navbar from "./components/Navbar";
import TodoComponent from "./components/Todo/TodoComponent";
import Timer from "./components/Pomodoro/Timer";
import { TodoAsPomo } from "./components/Pomodoro/SettingsTimer";

function App() {
  const [page, setPage] = useState("home");
  const [todoAsPomo, setTodoAsPomo] = useState<TodoAsPomo>({
    todoID: -1,
    todoTask: "",
  });

  const navigate = (pageName: string) => {
    setPage(pageName);
  };
  const handleGoToPomo = (itemTask: string, itemID: number) => {
    navigate("pomo");
    setTodoAsPomo({ todoID: itemID, todoTask: itemTask });
    console.log(itemTask, itemID);
  };

  return (
    <div className="bg-slate-950 text-zinc-50  min-h-[100vh]">
      <div className="border-b border-white pl-2 pt-2 h-[2.5em]">
        <Navbar onClick={navigate} />
      </div>
      {page === "home" ? null : page === "todo" ? (
        <TodoComponent handleGoToPomo={handleGoToPomo} />
      ) : page === "pomo" ? ( // <PomoComponent />
        <Timer todoAsPomo={todoAsPomo} />
      ) : null}
    </div>
  );
}

export default App;
