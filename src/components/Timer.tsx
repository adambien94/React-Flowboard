import React, { useEffect, useRef, useState, useCallback } from "react";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import { useTimerStore } from "../store/timerStore";
import formatTime from "../utils/formatTime";

interface TimerProps {
  show: boolean;
  onFinish?: (taskId: string, totalMs: number) => void;
}

const Timer: React.FC<TimerProps> = ({ show, onFinish }) => {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const {
    stopTimer,
    activeTaskId: activeTimerTaskId,
    clearActiveTaskId,
  } = useTimerStore();

  useEffect(() => {
    if (!show) return;

    setElapsed(0);
    startTimeRef.current = Date.now();
    setRunning(true);

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current && running) {
        setElapsed(Date.now() - startTimeRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [show, running]);

  const handleStop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    onFinish?.(activeTimerTaskId as string, elapsed);
    stopTimer();
  }, [activeTimerTaskId, elapsed, onFinish, stopTimer, clearActiveTaskId]);

  useEffect(() => {
    if (!show && running) {
      handleStop();
    }
  }, [show, running, handleStop]);

  return (
    <Toast
      show={show}
      style={{
        position: "absolute",
        bottom: "30px",
        right: "30px",
        width: "280px",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <Toast.Body className="d-flex justify-content-between items-center">
        <strong className="mt-1 fs-6">{formatTime(elapsed)}</strong>
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
