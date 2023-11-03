import { Pomodoro } from "./SettingsTimer";
import { SERVER } from "../../globals";

export const handleNewPomo = async (
  pomo: Pomodoro,
  startTime: number,
  endTime: number
) => {
  try {
    const response = await fetch(`${SERVER}/pomos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: pomo.task,
        duration: pomo.duration,
        started: startTime,
        finished: endTime,
        todoid: 0, // todo: get reference from todos
      }),
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    } else {
      const result = await response.json();
      console.log(result);
    }
  } catch (err) {
    // note: handle this err
    console.log(err);
  }
};
