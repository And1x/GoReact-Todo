import { useEffect, useState } from "react";
import { Pomodoro } from "./SettingsTimer";
import { MINUTES } from "./TimeHelpers";
import { getAllPomos } from "./httpRequests";

export default function ShowStats() {
  const [pomoList, setPomoList] = useState<Pomodoro[]>([]);
  const [showDate, setShowDate] = useState(false);

  function dateSwitch(timestamp: number | undefined) {
    if (!timestamp) {
      return "-";
    }
    const d = new Date(timestamp);
    return showDate ? d.toLocaleString() : d.toLocaleTimeString();
  }

  useEffect(() => {
    getAllPomos().then((pomos) => {
      pomos ? setPomoList(pomos) : null;
    });
  }, []);

  return (
    <>
      <div>
        <label htmlFor="showDate">Date</label>
        <input
          type="checkbox"
          name="Date"
          id="showDate"
          onClick={() => setShowDate(!showDate)}
          className="ml-2"
        />
      </div>
      <table className="text-center">
        <tr className="text-lg border-b">
          <th className="px-2">Task</th>
          <th className="px-2">Duration</th>
          <th className="px-2">Started</th>
          <th className="px-2">Finished</th>
          <th className="px-2">TodoID</th>
        </tr>
        {pomoList.map((p) => (
          <tr className="even:bg-slate-900">
            <td className="px-2">{p.task}</td>
            <td className="px-2">{p.duration / MINUTES}</td>
            <td className="px-2">{dateSwitch(p.started)}</td>
            <td className="px-2">{dateSwitch(p.finished)}</td>
            <td className="px-2">{p.todoid}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
