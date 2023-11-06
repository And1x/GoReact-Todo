import { useState } from "react";
import { MINUTES } from "./TimeHelpers";

export class Pomodoro {
  task: string;
  duration: number;
  started: number | undefined;
  finished: number | undefined;
  todoid: number | undefined;

  constructor(
    task = "Have fun:)",
    duration = 0.05,
    started?: number,
    finished?: number,
    todoid?: number
  ) {
    (this.task = task),
      (this.duration = duration * MINUTES),
      (this.started = started),
      (this.finished = finished),
      (this.todoid = todoid);
  }
}

export class PomodoroSession {
  pomo: Pomodoro;
  round: number;
  shortBreak: number;
  longBreak: number;

  constructor(
    pomo = new Pomodoro(),
    round = 8,
    shortBreak = 0.1,
    longBreak = 0.2
  ) {
    (this.pomo = pomo),
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
        : this.pomo.duration;
    return nextTime;
  }
}

export type TodoAsPomo = {
  todoTask: string;
  todoID: number;
};

export const PreConfSessions = {
  Test: new PomodoroSession(),
  Default: new PomodoroSession(
    new Pomodoro("Default Pomodoro Session", 25),
    4,
    5,
    15
  ),
  Quick: new PomodoroSession(
    new Pomodoro("Quick Pomodoro Session", 25),
    1,
    0,
    0
  ),
  FourHour: new PomodoroSession(
    new Pomodoro("Four Hour Pomodoro Session", 50),
    4,
    10,
    30
  ),
  MyFavourite: new PomodoroSession(
    new Pomodoro("My favourite Pomodoro Session", 50),
    1,
    10,
    0
  ),
};

interface Props {
  saveSettings: (p: PomodoroSession) => void;
  todoAsPomo: TodoAsPomo;
}

export default function SettingsForm({ saveSettings, todoAsPomo }: Props) {
  const [formSettings, setFormSettings] = useState(PreConfSessions.Default);

  // if Timer gets called by a Todo use this settings:
  if (todoAsPomo.todoID > 0) {
    setFormSettings(
      new PomodoroSession(
        new Pomodoro(
          todoAsPomo.todoTask,
          0.05,
          undefined,
          undefined,
          todoAsPomo.todoID
        ),
        1,
        10,
        0
      )
    );

    // reset it to avoid infinite loop
    todoAsPomo.todoID = -1;
    todoAsPomo.todoTask = "";
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex gap-3 justify-center w-full mb-2">
        {Object.keys(PreConfSessions).map((name) => {
          return (
            <button
              className="outline outline-white text-xs font-normal px-2 py-1 rounded hover:outline-emerald-600 hover:bg-slate-900"
              onClick={() => {
                setFormSettings(
                  PreConfSessions[name as keyof typeof PreConfSessions]
                );
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
      <div>
        <label className="block text-sm font-normal w-24" htmlFor="task_input">
          Task:
        </label>
        <input
          className="bg-slate-800 rounded outline-none text-lg w-[28rem] px-1 py-1"
          type="text"
          name=""
          id="task_input"
          placeholder={formSettings.pomo.task}
          onChange={(e) =>
            setFormSettings(
              new PomodoroSession(
                new Pomodoro(
                  e.target.value,
                  formSettings.pomo.duration / MINUTES
                ),
                formSettings.round,
                formSettings.shortBreak / MINUTES,
                formSettings.longBreak / MINUTES
              )
            )
          }
        />
      </div>

      <div className="flex gap-3">
        <div>
          <label
            className="block text-sm font-normal w-24"
            htmlFor="duration_input"
          >
            Time:
          </label>
          <input
            className="bg-slate-800 rounded outline-none text-lg w-[74px] px-1 py-1 ml-1"
            type="number"
            step={5}
            min={0}
            id="duration_input"
            value={formSettings.pomo.duration / MINUTES}
            onChange={(e) =>
              setFormSettings(
                new PomodoroSession(
                  new Pomodoro(formSettings.pomo.task, e.target.valueAsNumber),
                  formSettings.round,
                  formSettings.shortBreak / MINUTES,
                  formSettings.longBreak / MINUTES
                )
              )
            }
          />
        </div>
        <div>
          <label
            className="block text-sm font-normal w-24"
            htmlFor="rounds_input"
          >
            Rounds:
          </label>
          <input
            className="bg-slate-800 rounded outline-none text-lg w-[74px] px-1 py-1 ml-1"
            type="number"
            step={1}
            min={0}
            id="rounds_input"
            value={formSettings.round}
            onChange={(e) =>
              setFormSettings(
                new PomodoroSession(
                  new Pomodoro(
                    formSettings.pomo.task,
                    formSettings.pomo.duration / MINUTES
                  ),
                  e.target.valueAsNumber,
                  formSettings.shortBreak / MINUTES,
                  formSettings.longBreak / MINUTES
                )
              )
            }
          />
        </div>
      </div>
      <div className="flex gap-3">
        <div>
          <label
            className="block text-sm font-normal w-24"
            htmlFor="shortBreak_input"
          >
            Short Break:
          </label>
          <input
            className="bg-slate-800 rounded outline-none text-lg w-[74px] px-1 py-1 ml-1"
            type="number"
            step={5}
            min={0}
            id="shortBreak_input"
            value={formSettings.shortBreak / MINUTES}
            onChange={(e) =>
              setFormSettings(
                new PomodoroSession(
                  new Pomodoro(
                    formSettings.pomo.task,
                    formSettings.pomo.duration / MINUTES
                  ),
                  formSettings.round,
                  e.target.valueAsNumber,
                  formSettings.longBreak / MINUTES
                )
              )
            }
          />
        </div>
        <div>
          <label
            className="block text-sm font-normal w-24"
            htmlFor="longBreak_input"
          >
            Long Break:
          </label>
          <input
            className="bg-slate-800 rounded outline-none text-lg w-[74px] px-1 py-1 ml-1"
            type="number"
            step={5}
            min={0}
            id="longBreak_input"
            value={formSettings.longBreak / MINUTES}
            onChange={(e) =>
              setFormSettings(
                new PomodoroSession(
                  new Pomodoro(
                    formSettings.pomo.task,
                    formSettings.pomo.duration / MINUTES
                  ),
                  formSettings.round,
                  formSettings.shortBreak / MINUTES,
                  e.target.valueAsNumber
                )
              )
            }
          />
        </div>
      </div>
      <button
        className="bg-emerald-800 rounded px-2 hover:bg-emerald-600 self-end"
        onClick={() => {
          saveSettings(formSettings);
        }}
        type="submit"
      >
        Save
      </button>
    </div>
  );
}
