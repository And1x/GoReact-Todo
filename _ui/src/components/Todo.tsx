import { Todo } from "./TodoList";
import { ReactComponent as Checkmark } from "../assets/checkmark.svg";
import { ReactComponent as DeleteBtn } from "../assets/delete.svg";
import { ReactComponent as EditBtn } from "../assets/edit.svg";
import { ReactComponent as CloseBtn } from "../assets/close.svg";
import { useState, useRef } from "react";
import { SERVER } from "../globals";

interface Probs {
  item: Todo;
  updateList: () => void;
}

export default function TodoItem({ item, updateList }: Probs) {
  // export default function TodoItem({ item }: { item: Todo }) {
  const [expand, setExpand] = useState<boolean>(false);
  const [itemU, setItemU] = useState(item);
  const [editMode, setEditMode] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  // send get Request to change Done-state
  const handleClickDone = async () => {
    try {
      const response = await fetch(`http://localhost:7900/edit?id=${item.id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();
      setItemU(result);
    } catch (err) {
      // note: handle this err
      console.log(err);
    }
  };

  // edit whole todo:
  const handleSubmitEdit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:7900/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          title: titleInputRef.current?.value,
          content: contentInputRef.current?.value,
          done: itemU.done,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();
      // console.log(result);
      setEditMode(false);
      setItemU(result);
    } catch (err) {
      // note: handle this err
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${SERVER}/todo?id=${item.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      } else {
        alert("deleted");
        updateList();
      }
    } catch (err) {
      // note: handle this err
      console.log(err);
    }
  };

  return (
    <div
      className={`relative shadow-md w-[50vw] border border-emerald-400 bg-slate-950 rounded p-3`}
    >
      {!editMode ? (
        <>
          <div className="ml-9">
            <h4 className="truncate font-semibold text-lg text-orange-400 pr-14">
              <span
                className="text-white  mr-1 cursor-pointer"
                onClick={() => setExpand(!expand)}
              >
                {" "}
                {expand ? "▼" : "►"}
              </span>
              {itemU.title}
            </h4>
            {expand ? (
              <pre>
                <p className={`text-white`}>{itemU.content}</p>
              </pre>
            ) : null}
          </div>

          {itemU.done ? (
            <Checkmark
              className="absolute left-3 top-4 w-6 h-6 fill-emerald-600 cursor-pointer"
              onClick={handleClickDone}
            />
          ) : (
            <div
              className="absolute left-3 top-4 w-6 h-6 rounded-full bg-gray-300 cursor-pointer"
              onClick={handleClickDone}
            ></div>
          )}
          <div className="absolute right-1 top-1 flex gap-1">
            <EditBtn
              className="w-5 h-5 fill-emerald-50 cursor-pointer rounded hover:bg-slate-700"
              onClick={() => setEditMode(true)}
            />
            <DeleteBtn
              className="w-5 h-5 fill-red-700 cursor-pointer rounded hover:bg-slate-700"
              onClick={() => handleDelete()}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-1 ">
          <form onSubmit={handleSubmitEdit}>
            <label htmlFor="edit__title">Title:</label>
            <input
              ref={titleInputRef}
              className="w-full text-black mb-2"
              type="text"
              name="edit__title"
              id="edit__title"
              defaultValue={itemU.title}
            />
            <label htmlFor="edit__content">Content:</label>
            <textarea
              ref={contentInputRef}
              className="w-full text-black"
              rows={5}
              name="edit__content"
              id="edit__content"
              defaultValue={itemU.content}
            ></textarea>
            <button
              className="bg-slate-700 hover:text-emerald-400 w-fit rounded p-1 mt-2 self-end"
              type="submit"
            >
              update
            </button>
          </form>
          <CloseBtn
            className="absolute top-1 right-1 w-6 h-6 fill-red-700 cursor-pointer rounded hover:bg-slate-700"
            onClick={() => setEditMode(false)}
          />
        </div>
      )}
    </div>
  );
}
