import { Todo } from "./TodoList";
import { ReactComponent as Checkmark } from "../assets/checkmark.svg";
import { ReactComponent as Delete } from "../assets/delete.svg";
import { ReactComponent as Edit } from "../assets/edit.svg";
import { useState } from "react";

export default function TodoItem({ item }: { item: Todo }) {
  const [expand, setExpand] = useState<boolean>(false);
  const [isdone, setIsDone] = useState<boolean>(item.done);
  // todo: sent request to go with new Done-state

  // send get Request to change Done-state
  const handleDoneClick = async () => {
    console.log("got clickend");
    try {
      const response = await fetch(`http://localhost:8080/edit?id=${item.id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      // todo: rework this part -> currently we get whole todolist as response => we just need ok on successful change in the backend
      const result = await response.json();
      console.log(JSON.stringify(result));
    } catch (err) {
      console.log(err);
    } finally {
      setIsDone(!isdone);
    }
  };

  return (
    <div
      className={`relative shadow-md w-[50vw] border border-emerald-400 bg-slate-950 rounded p-3`}
    >
      <div className="ml-9">
        <h4 className="truncate font-semibold text-lg text-orange-400 pr-14">
          <span
            className="text-white  mr-1 cursor-pointer"
            onClick={() => setExpand(!expand)}
          >
            {" "}
            {expand ? "▼" : "►"}
          </span>
          {item.title}
        </h4>
        {expand ? <p className={`text-white`}>{item.content}</p> : null}
      </div>

      {isdone ? (
        <Checkmark
          className="absolute left-3 top-4 w-6 h-6 fill-emerald-600 cursor-pointer"
          onClick={handleDoneClick}
        />
      ) : (
        <div
          className="absolute left-3 top-4 w-6 h-6 rounded-full bg-gray-300 cursor-pointer"
          onClick={handleDoneClick}
        ></div>
      )}
      <div className="absolute right-1 top-1 flex gap-1">
        <Edit className="w-5 h-5 fill-emerald-50 cursor-pointer rounded hover:bg-slate-700" />
        <Delete className="w-5 h-5 fill-red-700 cursor-pointer rounded hover:bg-slate-700" />
      </div>
    </div>
  );
}
