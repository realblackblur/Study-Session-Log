import type { Session } from "./types";

export interface State {
  elapsedSeconds: number;
  isRunning: boolean;
  subjectName: string;
  sessions: Session[];
  errorMessage: string;
}

export const initialState: State = {
  elapsedSeconds: 0,
  isRunning: false,
  subjectName: "",
  sessions: [],
  errorMessage: "",
};

type Action =
  | { type: "toggle_timer" }
  | { type: "reset_timer" }
  | { type: "update_subject"; value: string }
  | { type: "save_session"; id: number }
  | { type: "timer_tick" };

function studyReducer(state: State, action: Action): State {
  switch (action.type) {
    case "toggle_timer":
      return {
        ...state,
        isRunning: !state.isRunning,
      };
    case "reset_timer":
      return {
        ...state,
        elapsedSeconds: 0,
        isRunning: false,
        errorMessage: "",
      };
    case "update_subject":
      return {
        ...state,
        subjectName: action.value,
      };
    case "save_session": {
      if (state.subjectName.trim() === "" && state.elapsedSeconds === 0) {
        return {
          ...state,
          isRunning: false,
          errorMessage: "Enter a subject name & Start the timer before saving",
        };
      }
      if (state.subjectName.trim() === "") {
        return {
          ...state,
          isRunning: false,
          errorMessage: "Enter a subject name",
        };
      }
      if (state.elapsedSeconds === 0) {
        return {
          ...state,
          isRunning: false,
          errorMessage: "Start the timer before saving",
        };
      }
      const newSession: Session = {
        id: action.id,
        subject: state.subjectName.trim(),
        durationSeconds: state.elapsedSeconds,
      };
      return {
        ...state,
        sessions: [...state.sessions, newSession],
        elapsedSeconds: 0,
        subjectName: "",
        isRunning: false,
        errorMessage: "",
      };
    }

    case "timer_tick":
      return {
        ...state,
        elapsedSeconds: state.elapsedSeconds + 1,
      };
    default:
      throw new Error("Unknown Action");
  }
}

export default studyReducer;
