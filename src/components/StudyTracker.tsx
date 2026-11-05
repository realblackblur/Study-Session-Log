import { useEffect, useState } from "react";
import formatTime from "../utils/formatTime";
import Timer from "./Timer";

interface Session {
  id: number;
  subject: string;
  durationSeconds: number;
}

function StudyTracker() {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [subjectName, setSubjectName] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    setErrorMessage("");
  }

  function handleSave() {
    setErrorMessage("");
    setIsRunning(false);

    if (subjectName.trim() === "" && elapsedSeconds === 0) {
      setErrorMessage("Enter a subject name & Start the timer before saving");
      return;
    }
    if (subjectName.trim() === "") {
      setErrorMessage("Enter a subject name");
      return;
    }
    if (elapsedSeconds === 0) {
      setErrorMessage("Start the timer before saving");
      return;
    }
    const newSession: Session = {
      id: Date.now(),
      subject: subjectName.trim(),
      durationSeconds: elapsedSeconds,
    };

    setSessions((prev) => [...prev, newSession]);

    setElapsedSeconds(0);
    setSubjectName("");
  }

  return (
    <>
      <Timer elapsedSeconds={elapsedSeconds} />
      <button onClick={() => setIsRunning((prev) => !prev)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={handleReset}>Reset</button>

      <div>
        <input
          type="text"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="Subject Name"
        />
        <button onClick={handleSave}>Save</button>
      </div>
      {errorMessage !== "" && <p>{errorMessage}</p>}
      <div>
        <h3>Saved Sessions</h3>
        {sessions.length === 0 && <p>No sessions yet!</p>}
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              {session.subject} - {formatTime(session.durationSeconds)}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default StudyTracker;
