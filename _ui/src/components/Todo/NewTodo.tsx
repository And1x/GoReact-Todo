import { useRef, useState } from "react";
import { SERVER } from "../../globals";
import Modal from "../Modal";

export default function NewTodo({ disableNew }: { disableNew: () => void }) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("fr-CA")
  );

  // edit whole todo:
  const handleSubmitNew = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${SERVER}/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleInputRef.current?.value,
          content: contentInputRef.current?.value,
          done: false,
          due: startDate,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      } else {
        const result = await response.json();
        console.log(result);
        disableNew();
      }
    } catch (err) {
      // note: handle this err
      console.log(err);
    }
  };

  return (
    <Modal onClose={disableNew}>
      <form onSubmit={handleSubmitNew} className="flex flex-col gap-3 w-[50vw]">
        <div>
          <label htmlFor="new__title">Title:</label>
          <input
            // placeholder="Title"
            ref={titleInputRef}
            className="bg-slate-800 rounded outline-none text-sm px-1 py-1 w-full"
            type="text"
            name="new__title"
            id="new__title"
          />
        </div>
        <div>
          <label htmlFor="new__content">Content:</label>
          <textarea
            // placeholder="Content"
            ref={contentInputRef}
            className="bg-slate-800 rounded outline-none text-sm px-1 py-1 w-full"
            rows={5}
            name="new__content"
            id="new__content"
          ></textarea>
        </div>
        <div>
          <label htmlFor="new__due">Due:</label>
          <input
            type="date"
            className="bg-slate-800 rounded outline-none text-sm px-1 py-1 ml-1"
            name="new__due"
            id="new__due"
            value={startDate}
            onChange={(e) =>
              setStartDate(new Date(e.target.value).toLocaleDateString("fr-CA"))
            }
          />
        </div>

        <button
          className="bg-emerald-800 rounded px-2 py-1 mt-1 hover:bg-emerald-600 self-end"
          type="submit"
        >
          create
        </button>
      </form>
    </Modal>
  );
}
