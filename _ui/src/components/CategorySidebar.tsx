import { ReactComponent as Gopher } from "../assets/gopher.svg";

export const dueDateCategories = {
  all: "all",
  today: "today",
  thisMonth: "month",
};

interface props {
  categories: object;
  onSelect: (c: string) => void;
}

export default function Sidebar({ categories, onSelect }: props) {
  return (
    <div className="pt-4 px-1 border-r border-white border-solid h-screen">
      <Gopher className="w-24 h-24 mb-4 animate-scale-in" />
      {Object.values(categories).map((cat) => (
        <div
          className="mb-4 cursor-pointer font-bold hover:text-emerald-400"
          onClick={() => onSelect(cat)}
        >
          {cat}
        </div>
      ))}
    </div>
  );
}
