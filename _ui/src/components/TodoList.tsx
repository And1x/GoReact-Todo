import { useEffect, useState } from "react";
import TodoItem from "./Todo";
import { SERVER } from "../globals";

const getTodoList = async () => {
  return fetch(`${SERVER}/show`).then((data) => data.json());
};

export interface Todo {
  id: number;
  title: string;
  content: string;
  done: boolean;
}

export default function TodoList() {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  useEffect(() => {
    getTodoList().then((todos) => {
      setTodoList(todos);
    });
  }, []);

  return (
    <>
      <div>
        <ul className="flex flex-col gap-4 items-center justify-center">
          {todoList.map((todo) => (
            <TodoItem
              key={todo.id}
              item={todo}
              updateList={() => {
                getTodoList().then((todos) => {
                  setTodoList(todos);
                });
              }}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
