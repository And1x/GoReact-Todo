import { useEffect, useState } from "react";
import TodoItem from "./Todo";
import { SERVER } from "../globals";
import { dueDateCategories } from "./CategorySidebar";

const getTodoList = async () => {
  return fetch(`${SERVER}/show`).then((data) => data.json());
};

export interface Todo {
  id: number;
  title: string;
  content: string;
  done: boolean;
  due: Date;
}

export default function TodoList({ filter }: { filter: string }) {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  useEffect(() => {
    getTodoList().then((todos) => {
      // filter
      switch (filter) {
        case dueDateCategories.today: {
          const fTodos = todos.filter(
            (todo: Todo) =>
              new Date(todo.due).toDateString() === new Date().toDateString()
          );
          setTodoList(fTodos);
          break;
        }
        case dueDateCategories.thisMonth: {
          const currentDate = new Date();
          const fTodos = todos.filter((todo: Todo) => {
            const todoDate = new Date(todo.due);
            return (
              todoDate.getFullYear() === currentDate.getFullYear() &&
              todoDate.getMonth() === currentDate.getMonth()
            );
          });
          setTodoList(fTodos);
          break;
        }
        default: {
          setTodoList(todos);
        }
      }
    });
  }, [filter]);

  return (
    <ul className="self-center">
      {todoList.map((todo) => (
        <li className="mb-4">
          <TodoItem
            key={todo.id}
            item={todo}
            updateList={() => {
              getTodoList().then((todos) => {
                setTodoList(todos);
              });
            }}
          />
        </li>
      ))}
    </ul>
  );
}
