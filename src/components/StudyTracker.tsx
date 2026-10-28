import { useEffect, useState } from "react";

function formatTime(totalSeconds: number): string {
  const hours: number = Math.floor(totalSeconds / 3600);
  const minutes: number = Math.floor((totalSeconds % 3600) / 60);
  const seconds: number = totalSeconds % 60;

  const hoursStr: string = hours < 10 ? "0" + hours : String(hours);
  const minutesStr: string = minutes < 10 ? "0" + minutes : String(minutes);
  const secondsStr: string = seconds < 10 ? "0" + seconds : String(seconds);

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

function StudyTracker() {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  function reset() {
    setElapsedSeconds(0);
    setIsRunning(false);
  }

  return (
    <>
      <h1>{formatTime(elapsedSeconds)}</h1>
      <button onClick={() => setIsRunning((prev) => !prev)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={reset}>Reset</button>
    </>
  );
}

export default StudyTracker;
