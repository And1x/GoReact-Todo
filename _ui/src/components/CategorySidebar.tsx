export const dueDateCategories = {
  all: "all",
  today: "today",
  thisMonth: "thisMonth",
};

interface props {
  categories: object;
  onSelect: (c: string) => void;
}

export default function Sidebar({ categories, onSelect }: props) {
  return (
    <div className="pt-28 px-1 border-r border-white border-double h-screen">
      {Object.values(categories).map((cat) => (
        <div className="mb-4 cursor-pointer" onClick={() => onSelect(cat)}>
          {cat}
        </div>
      ))}
    </div>
  );
}
