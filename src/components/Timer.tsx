import React, { useEffect, useRef, useState } from "react";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";

interface TimerProps {
  show: boolean;
  onFinish?: (totalMs: number) => void;
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

const Timer: React.FC<TimerProps> = ({ show, onFinish }) => {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!show) return;

    startTimeRef.current = Date.now();
    setRunning(true);

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current && running) {
        setElapsed(Date.now() - startTimeRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [show, running]);

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);

    console.log(`Logged time: ${formatTime(elapsed)}`);
    onFinish?.(elapsed);
  };

  return (
    <Toast
      bg="dark"
      show={show}
      style={{
        position: "absolute",
        bottom: "30px",
        right: "30px",
        width: "280px",
      }}
    >
      {/* <Toast.Header closeButton={false}>
        <strong className="me-auto text-muted">Timer</strong>
      </Toast.Header> */}

      <Toast.Body className="d-flex justify-content-between items-center">
        <strong className="mt-1  fs-6">{formatTime(elapsed)}</strong>

        <Button
          variant="dark"
          size="sm"
          onClick={handleStop}
          disabled={!running}
        >
          <i className="bi bi-pause-circle me-2"></i>
          Stop
        </Button>
      </Toast.Body>
    </Toast>
  );
};

export default Timer;
