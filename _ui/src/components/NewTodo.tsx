import { ReactComponent as CloseBtn } from "../assets/close.svg";
import { useRef } from "react";
import { SERVER } from "../globals";

export default function NewTodo({ disableNew }: { disableNew: () => void }) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

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
    <div
      className={`relative shadow-md w-[50vw] border border-emerald-400 bg-slate-950 rounded p-3`}
    >
      <div className="flex flex-col gap-1 ">
        <form onSubmit={handleSubmitNew}>
          <label htmlFor="new__title">Title:</label>
          <input
            ref={titleInputRef}
            className="w-full text-black mb-2"
            type="text"
            name="new__title"
            id="new__title"
          />
          <label htmlFor="new__content">Content:</label>
          <textarea
            ref={contentInputRef}
            className="w-full text-black"
            rows={5}
            name="new__content"
            id="new__content"
          ></textarea>
          <button
            className="bg-slate-700 hover:text-emerald-400 w-fit rounded p-1 mt-2 self-end"
            type="submit"
          >
            create
          </button>
        </form>
        <CloseBtn
          className="absolute top-1 right-1 w-6 h-6 fill-red-700 cursor-pointer rounded hover:bg-slate-700"
          onClick={() => disableNew()}
        />
      </div>
    </div>
  );
}
