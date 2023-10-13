import { useRef } from "react";
import { MINUTES } from "./TimeHelpers";

export class Pomodoro {
  duration: number;
  round: number;
  shortBreak: number;
  longBreak: number;

  constructor(duration = 0.05, round = 8, shortBreak = 0.1, longBreak = 0.2) {
    (this.duration = duration * MINUTES),
      (this.round = round),
      (this.shortBreak = shortBreak * MINUTES),
      (this.longBreak = longBreak * MINUTES);
  }

  getTime(currentRound: number) {
    const nextTime =
      (currentRound + 1) % 8 === 0
        ? this.longBreak
        : (currentRound + 1) % 2 === 0
        ? this.shortBreak
        : this.duration;
    return nextTime;
  }
}

export const PreConfSessions = {
  Default: new Pomodoro(),
  Standard: new Pomodoro(25, 4, 5, 15),
  Quick: new Pomodoro(25, 1, 0, 0),
  FourHour: new Pomodoro(50, 4, 10, 30),
  MyFavourite: new Pomodoro(50, 1, 10, 0),
};

interface Props {
  saveSettings: (duration: number, rounds: number) => void;
}

export default function SettingsForm({ saveSettings }: Props) {
  const durationRef = useRef<HTMLInputElement>(null);
  const roundsRef = useRef<HTMLInputElement>(null);
  const taskRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2 items-start">
      <div>
        <label className="block" htmlFor="task_input">
          Task:
        </label>
        <input
          className="bg-slate-800 rounded outline-none text-sm w-[28rem] px-1 py-1"
          type="text"
          name=""
          id="task_input"
          ref={taskRef}
          placeholder="Have fun:)"
        />
      </div>

      <div className="flex gap-3">
        <div>
          <label className="" htmlFor="duration_input">
            Time:
          </label>
          <input
            className="bg-slate-800 rounded outline-none text-sm w-16 px-1 py-1 ml-1"
            type="number"
            step={5}
            min={0}
            id="duration_input"
            ref={durationRef}
            placeholder={"25"}
          />
        </div>
        <div>
          <label className="" htmlFor="rounds_input">
            Rounds:
          </label>
          <input
            className="bg-slate-800 rounded outline-none text-sm w-16 px-1 py-1 ml-1"
            type="number"
            step={1}
            min={0}
            id="rounds_input"
            ref={roundsRef}
            placeholder="1"
          />
        </div>
      </div>
      <button
        className="bg-emerald-800 rounded px-2 hover:bg-emerald-600 self-end"
        onClick={() => {
          saveSettings(
            durationRef.current?.valueAsNumber
              ? durationRef.current?.valueAsNumber
              : 25,
            roundsRef.current?.valueAsNumber
              ? roundsRef.current?.valueAsNumber
              : 1
          );
        }}
        type="submit"
      >
        Save
      </button>
    </div>
  );
}
