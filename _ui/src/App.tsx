import "./App.css";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div className="bg-slate-900 text-zinc-50 font-mono h-[100vh]">
      <h1 className="text-3xl text-center mb-6">Go React</h1>
      <TodoList />
    </div>
  );
}

export default App;
