import { useEffect, useState } from "react";
import type { Session } from "../types";
import SessionForm from "./SessionForm";
import SessionList from "./SessionList";
import Timer from "./Timer";
import TimerControls from "./TimerControls";

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
    <main className="app">
      <header className="app-header">
        <h1>Study Tracker</h1>
        <p>Track your focus. Build better habits.</p>
      </header>

      <Timer elapsedSeconds={elapsedSeconds} />

      <TimerControls
        isRunning={isRunning}
        onToggle={() => setIsRunning((prev) => !prev)}
        onReset={handleReset}
      />

      <SessionForm
        subjectName={subjectName}
        errorMessage={errorMessage}
        onSubjectChange={setSubjectName}
        onSave={handleSave}
      />

      <SessionList sessions={sessions} />
    </main>
  );
}

export default StudyTracker;
