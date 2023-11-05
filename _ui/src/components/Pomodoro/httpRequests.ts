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
        todoid: pomo.todoid,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    } else {
      console.log(response);
    }
  } catch (err) {
    // note: handle this err
    console.log(err);
  }
};
