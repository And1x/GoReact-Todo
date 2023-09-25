interface Props {
  onClick: (str: string) => void;
}

export default function Navbar({ onClick }: Props) {
  return (
    <ul className="flex flex-row gap-8 text-emerald-600 text-2xl font-semibold">
      <li
        className="hover:text-emerald-200 hover:cursor-pointer"
        onClick={() => onClick("home")}
      >
        Home
      </li>
      <li
        className="hover:text-emerald-200 hover:cursor-pointer"
        onClick={() => onClick("todo")}
      >
        Todo
      </li>
      <li
        className="hover:text-emerald-200 hover:cursor-pointer"
        onClick={() => onClick("pomo")}
      >
        Pomodoro
      </li>
    </ul>
  );
}
