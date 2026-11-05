function formatTime(totalSeconds: number): string {
  const hours: number = Math.floor(totalSeconds / 3600);
  const minutes: number = Math.floor((totalSeconds % 3600) / 60);
  const seconds: number = totalSeconds % 60;

  const hoursStr: string = hours < 10 ? "0" + hours : String(hours);
  const minutesStr: string = minutes < 10 ? "0" + minutes : String(minutes);
  const secondsStr: string = seconds < 10 ? "0" + seconds : String(seconds);

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

export default formatTime;
