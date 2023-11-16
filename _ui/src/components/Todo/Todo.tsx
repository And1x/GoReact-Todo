import { Todo } from "./TodoList";
import { ReactComponent as Checkmark } from "../../assets/checkmark.svg";
import { ReactComponent as DeleteBtn } from "../../assets/delete.svg";
import { ReactComponent as EditBtn } from "../../assets/edit.svg";
import { ReactComponent as TimerBtn } from "../../assets/timer.svg";
import CustomMarkDown from "./CustomMarkDown";
import { useState, useRef } from "react";
import { SERVER } from "../../globals";
import Modal from "../Modal";

interface Props {
  item: Todo;
  updateList: () => void;
  handleGoToPomo: (itemTitle: string, itemID: number) => void;
}

export default function TodoItem({ item, updateList, handleGoToPomo }: Props) {
  const [expand, setExpand] = useState<boolean>(false);
  const [itemU, setItemU] = useState(item);
  const [editMode, setEditMode] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [startDate, setStartDate] = useState(
    new Date(itemU.due).toLocaleDateString("fr-CA") // fr-CA local needed because HTML <input type=date> expects format 'yyyy-MM-dd'
  );
  const dateNow = new Date();
  const dateItem = new Date(itemU.due);
  const dueColor = itemU.done
    ? "text-white"
    : dateNow.toDateString() === dateItem.toDateString() // just compare Y/M/D without time (h/m/s...)
    ? "text-green-600"
    : dateNow > dateItem
    ? "text-red-600"
    : "text-green-600";

  // send get Request to change Done-state
  const handleClickDone = async () => {
    try {
      const response = await fetch(`${SERVER}/edit?id=${item.id}`, {
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
      const response = await fetch(`${SERVER}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          title: titleInputRef.current?.value,
          content: contentInputRef.current?.value,
          done: itemU.done,
          due: startDate,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const result = await response.json();
      setItemU(result);
      setEditMode(false);
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
    <>
      <div className="relative rounded-lg w-[50vw] border border-blue-900 bg-black p-3">
        <div className="ml-10">
          <h4 className="truncate font-semibold text-lg text-orange-400 pr-14">
            <span
              className="text-white  mr-2 cursor-pointer"
              onClick={() => setExpand(!expand)}
            >
              {expand ? "▼" : "►"}
            </span>
            {itemU.title}
          </h4>
          {expand ? (
            <>
              <CustomMarkDown content={itemU.content} />
              <div className="text-sm border-t border-white mt-2 pt-1 flex justify-between">
                <div>
                  Due:
                  <span className={dueColor}>
                    {" " + new Date(itemU.due).toLocaleDateString()}
                  </span>
                </div>
                <TimerBtn
                  className="w-5 h-5 fill-white hover:fill-emerald-600 cursor-pointer"
                  onClick={() => handleGoToPomo(itemU.title, itemU.id)}
                />
              </div>
            </>
          ) : null}
        </div>

        {itemU.done ? (
          <Checkmark
            className="absolute left-3 top-3 w-7 h-7 fill-emerald-600 cursor-pointer"
            onClick={handleClickDone}
          />
        ) : (
          <div
            className="absolute left-3 top-3 w-7 h-7 rounded-full bg-gray-300 cursor-pointer"
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
      </div>

      {editMode ? (
        <Modal
          onClose={() => {
            setEditMode(false);
          }}
        >
          <form
            onSubmit={handleSubmitEdit}
            className="flex flex-col gap-3 w-[50vw]"
          >
            <div>
              <label htmlFor="edit__title">Title:</label>
              <input
                ref={titleInputRef}
                className="bg-slate-800 rounded outline-none text-sm w-full px-1 py-1"
                type="text"
                name="edit__title"
                id="edit__title"
                defaultValue={itemU.title}
              />
            </div>
            <div>
              <label htmlFor="edit__content">Content:</label>
              <textarea
                ref={contentInputRef}
                className="bg-slate-800 rounded outline-none text-sm w-full px-1 py-1"
                rows={5}
                name="edit__content"
                id="edit__content"
                defaultValue={itemU.content}
              ></textarea>
            </div>
            <div>
              <label className="inline" htmlFor="new__due">
                Due:
              </label>
              <input
                type="date"
                className="bg-slate-800 rounded outline-none text-sm px-1 py-1 ml-1"
                name="new__due"
                id="new__due"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    new Date(e.target.value).toLocaleDateString("fr-CA")
                  )
                }
              />
            </div>
            <button
              className="bg-emerald-800 rounded px-2 py-1 mt-2 hover:bg-emerald-600 self-end"
              type="submit"
            >
              update
            </button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
