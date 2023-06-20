import { Todo } from "./TodoList";
import { ReactComponent as Checkmark } from "../assets/checkmark.svg";
import { ReactComponent as Delete } from "../assets/delete.svg";
import { ReactComponent as Edit } from "../assets/edit.svg";
import { useState } from "react";

export default function TodoItem({ item }: { item: Todo }) {
  const [expand, setExpand] = useState<boolean>(false);
  const [isdone, setIsDone] = useState<boolean>();
  // todo: sent request to go with new Done-state

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
          onClick={() => {
            setIsDone(false);
          }}
        />
      ) : (
        <div
          className="absolute left-3 top-4 w-6 h-6 rounded-full bg-gray-300 cursor-pointer"
          onClick={() => {
            setIsDone(true);
          }}
        ></div>
      )}
      <div className="absolute right-1 top-1 flex gap-1">
        <Edit className="w-5 h-5 fill-emerald-50 cursor-pointer rounded hover:bg-slate-700" />
        <Delete className="w-5 h-5 fill-red-700 cursor-pointer rounded hover:bg-slate-700" />
      </div>
    </div>
  );
}
