import { useEffect, useState } from "react";
import TodoItem from "./Todo";
import { SERVER } from "../../globals";
import { Categories } from "./CategorySidebar";

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

interface Props {
  filter: string;
  handleGoToPomo: (itemTitle: string, itemID: number) => void;
}

export default function TodoList({ filter, handleGoToPomo }: Props) {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  useEffect(() => {
    getTodoList().then((todos) => {
      // filter
      switch (filter) {
        case Categories.today: {
          const fTodos = todos.filter(
            (todo: Todo) =>
              new Date(todo.due).toDateString() === new Date().toDateString()
          );
          setTodoList(fTodos);
          break;
        }
        case Categories.thisMonth: {
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
        case Categories.done: {
          const fTodos = todos.filter((todo: Todo) => todo.done === true);
          setTodoList(fTodos);
          break;
        }
        case Categories.open: {
          const fTodos = todos.filter((todo: Todo) => todo.done === false);
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
            handleGoToPomo={handleGoToPomo}
          />
        </li>
      ))}
    </ul>
  );
}
