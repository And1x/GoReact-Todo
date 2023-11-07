import { useEffect, useState } from "react";
import { Pomodoro } from "./SettingsTimer";
import { MINUTES } from "./TimeHelpers";
import { getPomos } from "./httpRequests";

type CustomDate = {
  from: string;
  to: string;
};

export default function ShowStats() {
  const [pomoList, setPomoList] = useState<Pomodoro[]>([]);
  const [showDate, setShowDate] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState<CustomDate>({
    from: "",
    to: "",
  });
  let totalDuration = 0;

  function dateSwitch(timestamp: number | undefined) {
    if (!timestamp) {
      return "-";
    }
    const d = new Date(timestamp);
    return showDate ? d.toLocaleString() : d.toLocaleTimeString();
  }

  useEffect(() => {
    // first select option should be the same
    getPomos(["today"]).then((pomos) => {
      pomos ? setPomoList(pomos) : null;
    });
  }, []);

  function handleSelect(filter: string) {
    if (filter === "custom") {
      setShowCustomDate(true);
      return;
    } else {
      setShowCustomDate(false);
    }
    getPomos([filter]).then((pomos) => {
      if (pomos) {
        setPomoList(pomos);
      }
    });
  }

  const handleSubmitCustomDate = (e: React.SyntheticEvent) => {
    e.preventDefault();
    getPomos([customDate.from, customDate.to]).then((pomos) => {
      if (pomos) {
        setPomoList(pomos);
      }
    });
  };

  return (
    // see modal p and navbar to get actual height
    <div className="min-h-[calc(100vh-2.5em-48px)] w-[573px]">
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
      <div>
        <select
          name="selectTimeFrame"
          id="selectTimeFrame"
          className="bg-slate-800 outline-none text-xl"
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
          <option value="custom">Custom</option>
        </select>

        {showCustomDate ? (
          <div className="flex justify-between my-4 p-2 border border-double rounded border-violet-300">
            <div>
              <label htmlFor="from">From:</label>
              <input
                type="date"
                name="from"
                id="from"
                className="bg-slate-800 ml-2"
                onChange={(e) =>
                  setCustomDate((values) => ({
                    ...values,
                    from: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="to">To:</label>
              <input
                type="date"
                name="to"
                id="to"
                className="bg-slate-800 ml-2"
                onChange={(e) =>
                  setCustomDate((values) => ({
                    ...values,
                    to: e.target.value,
                  }))
                }
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-800 rounded px-2 hover:bg-emerald-600"
              onClick={handleSubmitCustomDate}
            >
              show
            </button>
          </div>
        ) : null}
      </div>
      <table className="text-center w-full">
        <tr className="text-lg border-b">
          <th className="px-2">No.</th>
          <th className="px-2">Task</th>
          <th className="px-2">Duration</th>
          <th className="px-2">Started</th>
          <th className="px-2">Finished</th>
          <th className="px-2">TodoID</th>
        </tr>
        {pomoList.map((p) => {
          totalDuration += p.duration;
          return (
            <tr className="even:bg-slate-900">
              <td className="px-2">{p.id}</td>
              <td className="px-2">{p.task}</td>
              <td className="px-2">{p.duration / MINUTES}</td>
              <td className="px-2">{dateSwitch(p.started)}</td>
              <td className="px-2">{dateSwitch(p.finished)}</td>
              <td className="px-2">{p.todoid}</td>
            </tr>
          );
        })}
        <tr className="border-t-2 text-emerald-500">
          <td>{pomoList.length}</td>
          <td></td>
          <td>{totalDuration / MINUTES}</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
  );
}
