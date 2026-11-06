import type { Session } from "../types";
import formatTime from "../utils/formatTime";

interface SessionListProps {
  sessions: Session[];
}

function SessionList({ sessions }: SessionListProps) {
  return (
    <>
      <h3>Saved Sessions</h3>
      {sessions.length === 0 && <p>No sessions yet!</p>}
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            {session.subject} - {formatTime(session.durationSeconds)}
          </li>
        ))}
      </ul>
    </>
  );
}

export default SessionList;
