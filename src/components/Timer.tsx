import formatTime from "../utils/formatTime";

interface TimerProps {
  elapsedSeconds: number;
}

function Timer({ elapsedSeconds }: TimerProps) {
  return <h1>{formatTime(elapsedSeconds)}</h1>;
}

export default Timer;
