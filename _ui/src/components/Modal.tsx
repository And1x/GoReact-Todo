import { ReactElement } from "react";
import { ReactComponent as CloseIcon } from "../assets/close.svg";

type Probs = {
  children: ReactElement;
  onClose: (event: React.MouseEvent<HTMLElement>) => void;
};

export default function Modal({ onClose, children }: Probs) {
  return (
    <div
      className="flex justify-center items-center fixed inset-0 z-50 backdrop-blur-sm "
      onClick={onClose}
    >
      <div
        className="relative border rounded-lg border-violet-600 shadow-violet-600 shadow-md  bg-black font-medium px-6 pt-12 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 bg-transparent"
          onClick={onClose}
        >
          <CloseIcon className="w-8 h-8 fill-slate-400 hover:fill-red-600" />
        </button>
        {children}
      </div>
    </div>
  );
}
