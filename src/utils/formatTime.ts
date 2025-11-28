export const formatTime = (ms: number, isFormatTimeLabel?: boolean) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return isFormatTimeLabel
    ? `${hours ? String(hours) + "h" : ""} ${String(minutes) + "min"} ${
        String(seconds) + "s"
      }`
    : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
};

export default formatTime;
