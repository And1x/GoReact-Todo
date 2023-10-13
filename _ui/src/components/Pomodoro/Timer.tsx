import { useEffect, useState, useRef } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ReactComponent as SettingsIcon } from "../../assets/settings.svg";
import { ReactComponent as PauseIcon } from "../../assets/pause.svg";
import { ReactComponent as PlayIcon } from "../../assets/play_arrow.svg";
import { ReactComponent as ReplayIcon } from "../../assets/replay.svg";
import Modal from "../Modal";
import SettingsForm, { Pomodoro, PreConfSessions } from "./SettingsTimer";
import { SECONDS, MINUTES, HOURS, displayTime } from "./TimeHelpers";

export default function Timer() {
  const [pomodoro, setPomodoro] = useState(PreConfSessions.Standard);
  const [showSettings, setShowSettings] = useState(false);
  const [roundCounter, setRoundCounter] = useState(0);
  const [time, setTime] = useState(pomodoro.duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number>();

  const closeShowSettings = () => {
    setShowSettings(false);
  };

  // todo: add other fields - rounds/breaks/task ...
  const handleSettings = (t: number, r: number) => {
    setPomodoro(new Pomodoro(t, r));
    setRoundCounter(0);
    setTime(t * MINUTES);
    setShowSettings(false);
  };

  const handleSkipBreak = () => {
    if (roundCounter < pomodoro.round * 2) {
      setRoundCounter(roundCounter + 1);
    }

    setIsRunning(false);
    setTime(pomodoro.getTime(roundCounter + 1));
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isRunning) {
      console.log("T1: Start: ", Date.now());
      intervalRef.current = setInterval(() => {
        setTime((curTime) => {
          if (curTime <= 0) {
            console.log("T1: End: ", Date.now());
            if (roundCounter < pomodoro.round * 2) {
              setRoundCounter(roundCounter + 1);
            }
            setIsRunning(false);
            clearInterval(intervalRef.current);

            return pomodoro.getTime(roundCounter + 1);
          } else {
            return curTime - 1 * SECONDS;
          }
        });
      }, SECONDS);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, roundCounter, pomodoro]);

  return (
    <>
      <div className="flex flex-col justify-center items-center pt-8">
        <div className="w-80 h-80 relative">
          <CircularProgressbarWithChildren
            strokeWidth={9}
            value={(100 / pomodoro.getTime(roundCounter)) * time} // in percent
            styles={buildStyles({
              rotation: 1,
              strokeLinecap: "butt",
              pathColor: "#082f42",
              trailColor: (roundCounter + 1) % 2 == 0 ? "#fbbf24" : "#10b981",
              pathTransition: isRunning ? "" : "none",
            })}
          >
            <div className="relative">
              <div className="flex gap-2 font-medium text-5xl">
                {displayTime(Math.floor(time / HOURS))}
                <span>:</span>
                {displayTime(Math.floor((time / MINUTES) % 60))}
                <span>:</span>
                {displayTime(Math.floor((time / SECONDS) % 60))}
              </div>
              <div
                className="absolute left-[50%] -translate-x-1/2"
                title="rounds - breaks don't count as round"
              >
                {Math.floor((roundCounter + 1) / 2)} of {pomodoro.round}
              </div>

              {(roundCounter + 1) % 2 == 0 ? (
                <div
                  className="absolute left-[50%] -translate-x-1/2 top-20 text-rose-600 cursor-pointer"
                  onClick={() => handleSkipBreak()}
                >
                  skip break
                </div>
              ) : null}
            </div>
          </CircularProgressbarWithChildren>

          <button
            className="absolute top-0 right-0"
            onClick={() => {
              setShowSettings(!showSettings);
            }}
          >
            <SettingsIcon className="w-6 h-6 fill-white hover:fill-emerald-600" />
          </button>
        </div>
        <div className="flex gap-5 pt-4">
          <button
            className="w-12 h-12 font-bold text-lg rounded px-1 py-1 outline outline-1 outline-violet-600 hover:outline-2"
            onClick={() => {
              // show Settings to restart when all rounds are over
              if (roundCounter === pomodoro.round * 2) {
                setShowSettings(true);
              } else {
                // usual pause/play button
                if (isRunning) {
                  clearInterval(intervalRef.current);
                }
                setIsRunning(!isRunning);
              }
            }}
          >
            {isRunning ? (
              <PauseIcon className="w-10 h-10 fill-white" />
            ) : (
              <PlayIcon className="w-10 h-10 fill-white" />
            )}
          </button>
          <button
            className="w-12 h-12 font-bold text-lg rounded px-2 py-1 outline outline-1 outline-violet-600 hover:outline-2"
            onClick={() => {
              setIsRunning(false);
              setTime(pomodoro.getTime(roundCounter));
            }}
          >
            <ReplayIcon className="w-8 h-8 fill-white" />
          </button>
        </div>
      </div>
      {showSettings ? (
        <Modal onClose={closeShowSettings}>
          <SettingsForm saveSettings={handleSettings} />
        </Modal>
      ) : null}
    </>
  );
}
