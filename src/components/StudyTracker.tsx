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

interface Session {
  id: number;
  subject: string;
  time: number;
}

function StudyTracker() {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [lists, setLists] = useState<Session[]>([]);

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

  function handleReset() {
    setElapsedSeconds(0);
    setIsRunning(false);
  }

  function handleSave() {
    const newSession: Session = {
      id: Date.now(),
      subject: text,
      time: elapsedSeconds,
    };

    setLists((prev) => [...prev, newSession]);

    setElapsedSeconds(0);
    setIsRunning(false);
    setText("");
  }

  return (
    <>
      <h1>{formatTime(elapsedSeconds)}</h1>
      <button onClick={() => setIsRunning((prev) => !prev)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={handleReset}>Reset</button>
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Subject Name"
        />
        <button onClick={handleSave}>Save</button>
      </div>
      <div>
        <h3>Saved Sessions</h3>
        <ul>
          {lists.map((session) => (
            <li key={session.id}>
              {session.subject} - {formatTime(session.time)}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default StudyTracker;
