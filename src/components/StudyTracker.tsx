import { useEffect, useReducer } from "react";
import studyReducer, { initialState } from "../studyReducer";
import SessionForm from "./SessionForm";
import SessionList from "./SessionList";
import Timer from "./Timer";
import TimerControls from "./TimerControls";

function StudyTracker() {
  const [state, dispatch] = useReducer(studyReducer, initialState);

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }

    const interval = setInterval(() => {
      dispatch({ type: "timer_tick" });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [state.isRunning]);

  return (
    <main className="app">
      <header className="app-header">
        <h1>Study Tracker</h1>
        <p>Track your focus. Build better habits.</p>
      </header>

      <Timer elapsedSeconds={state.elapsedSeconds} />

      <TimerControls
        isRunning={state.isRunning}
        onToggle={() => dispatch({ type: "toggle_timer" })}
        onReset={() => dispatch({ type: "reset_timer" })}
      />

      <SessionForm
        subjectName={state.subjectName}
        errorMessage={state.errorMessage}
        onSubjectChange={(value) => dispatch({ type: "update_subject", value })}
        onSave={() => dispatch({ type: "save_session", id: Date.now() })}
      />

      <SessionList sessions={state.sessions} />
    </main>
  );
}

export default StudyTracker;
