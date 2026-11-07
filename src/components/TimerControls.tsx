interface TimerControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

function TimerControl({ isRunning, onToggle, onReset }: TimerControlsProps) {
  return (
    <>
      <button onClick={onToggle}>{isRunning ? "Pause" : "Start"}</button>
      <button onClick={onReset}>Reset</button>
    </>
  );
}

export default TimerControl;

