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
import { ReactComponent as ListIcon } from "../../assets/list.svg";
import Modal from "../Modal";
import SettingsForm, {
  PomodoroSession,
  PreConfSessions,
  TodoAsPomo,
} from "./SettingsTimer";
import { SECONDS, MINUTES, HOURS, displayTime } from "./TimeHelpers";
import { handleSaveNewPomo } from "./httpRequests";
import ShowStats from "./ShowStats";

interface Props {
  todoAsPomo: TodoAsPomo;
}

export default function Timer({ todoAsPomo }: Props) {
  const [pomSession, setPomSession] = useState(PreConfSessions.Default);
  const [showSettings, setShowSettings] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [roundCounter, setRoundCounter] = useState(0);
  const [time, setTime] = useState(pomSession.pomo.duration * MINUTES); // in ms
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number>();
  const tempDurationRef = useRef(pomSession.pomo.duration);
  const tempStartedRef = useRef<number>(0);

  const closeShowSettings = () => {
    setShowSettings(false);
  };

  const handleSettings = (p: PomodoroSession) => {
    setPomSession(p);
    setRoundCounter(0);
    setTime(p.pomo.duration * MINUTES);
    setShowSettings(false);
  };

  const handleSkipBreak = () => {
    if (roundCounter < pomSession.round * 2) {
      setRoundCounter(roundCounter + 1);
    }

    setIsRunning(false);
    setTime(pomSession.getTime(roundCounter + 1) * MINUTES);
    clearInterval(intervalRef.current);
  };

  function isBreak(roundCounter: number) {
    return (roundCounter + 1) % 2 === 0;
  }

  useEffect(() => {
    if (isRunning) {
      pomSession.pomo.started ? null : (pomSession.pomo.started = Date.now());
      tempStartedRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        setTime((curTime) => {
          if (curTime < 250) {
            pomSession.pomo.finished = Date.now();
            if (roundCounter < pomSession.round * 2) {
              setRoundCounter(roundCounter + 1);
            }
            setIsRunning(false);
            clearInterval(intervalRef.current);
            !isBreak(roundCounter) ? handleSaveNewPomo(pomSession.pomo) : null;
            return pomSession.getTime(roundCounter + 1) * MINUTES;
          } else {
            return (
              tempDurationRef.current * MINUTES -
              (Date.now() - tempStartedRef.current)
            );
          }
        });
      }, 200); // 200ms seems fine; eg. 1000ms is to imprecise and will cause visual jumps of Seconds
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, roundCounter, pomSession]);

  return (
    <>
      <div className="flex flex-col justify-center items-center pt-8">
        <div className="w-80 h-80 relative">
          <CircularProgressbarWithChildren
            strokeWidth={9}
            value={
              (100 / (pomSession.getTime(roundCounter) * 60)) *
              Math.floor(time / 1000)
            } // in percent
            styles={buildStyles({
              rotation: 1,
              strokeLinecap: "butt",
              pathColor: "#082f42",
              trailColor: isBreak(roundCounter) ? "#fbbf24" : "#10b981",
              pathTransition: isRunning ? "" : "none",
            })}
          >
            <div className="relative">
              <div className="flex font-medium text-5xl">
                <div className="w-[4rem] text-center">
                  {displayTime(Math.floor(time / HOURS))}
                </div>
                <span>:</span>
                <div className="w-[4rem] text-center">
                  {displayTime(Math.floor((time / MINUTES) % 60))}
                </div>
                <span>:</span>
                <div className="w-[4rem] text-center">
                  {displayTime(Math.floor((time / SECONDS) % 60))}
                </div>
              </div>
              <div
                className="absolute left-[50%] -translate-x-1/2"
                title="rounds - breaks don't count as round"
              >
                {Math.floor((roundCounter + 1) / 2)} of {pomSession.round}
              </div>

              {isBreak(roundCounter) ? (
                <div
                  className="absolute left-[50%] -translate-x-1/2 top-20 text-rose-600 cursor-pointer"
                  onClick={() => handleSkipBreak()}
                >
                  skip break
                </div>
              ) : null}
            </div>
          </CircularProgressbarWithChildren>
          <div className="absolute top-0 right-0">
            <button
              onClick={() => {
                setShowSettings(!showSettings);
              }}
            >
              <SettingsIcon className="w-7 h-7 fill-white hover:fill-emerald-600" />
            </button>
            <button onClick={() => setShowStats(true)}>
              <ListIcon className="w-7 h-7 fill-white hover:fill-emerald-600"></ListIcon>
            </button>
          </div>
        </div>
        <div className="flex gap-5 pt-4">
          <button
            className="w-12 h-12 font-bold text-lg rounded px-1 py-1 outline outline-1 outline-violet-600 hover:outline-2"
            onClick={() => {
              // show Settings to restart when all rounds are over
              if (roundCounter === pomSession.round * 2) {
                setShowSettings(true);
                // on rerun use todo Info again
                todoAsPomo.todoID = pomSession.pomo.todoid
                  ? pomSession.pomo.todoid
                  : -1;
                todoAsPomo.todoTask = pomSession.pomo.task;
              } else {
                // usual pause/play button
                if (isRunning) {
                  clearInterval(intervalRef.current);
                }
                setIsRunning(!isRunning);
                tempDurationRef.current = time / MINUTES;
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
              setTime(pomSession.getTime(roundCounter) * MINUTES);
            }}
          >
            <ReplayIcon className="w-8 h-8 fill-white" />
          </button>
        </div>
      </div>
      {showSettings ? (
        <Modal onClose={closeShowSettings}>
          <SettingsForm saveSettings={handleSettings} todoAsPomo={todoAsPomo} />
        </Modal>
      ) : null}
      {showStats ? (
        <Modal onClose={() => setShowStats(false)}>
          <ShowStats />
        </Modal>
      ) : null}
    </>
  );
}
