import { Pomodoro } from "./SettingsTimer";
import { SERVER } from "../../globals";

export const handleSaveNewPomo = async (pomo: Pomodoro) => {
  try {
    const response = await fetch(`${SERVER}/pomos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: pomo.task,
        duration: pomo.duration,
        started: pomo.started,
        finished: pomo.finished,
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
