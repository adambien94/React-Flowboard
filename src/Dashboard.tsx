import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskDrawer from "./components/TaskDrawer";
import Timer from "./components/Timer";
import AddColumnModal from "./components/AddColumnModal";
import TaskModal from "./components/TaskModal";
import DashboardTopBar from "./components/dashboard/DashboardTopBar";
import DashboardInitHeader from "./components/dashboard/DashboardInitHeader";
import DashboardColumns from "./components/dashboard/DashboardColumns";
import { useTimerStore } from "./store/timerStore";
import ConfirmModal from "./components/ConfirmModal";
import formatTime from "./utils/formatTime";
import { useBoardStore } from "./hooks/useBoardStore";
import BoardLoader from "./components/dashboard/BoardLoader";
import { useTaskModalStore } from "./store/taskModalStore";
import { syncTaskModalWithUrl } from "./store/taskModalStore";
import { syncTaskDrawerWithUrl } from "./store/taskDrawerStore";

export default function Dashboard() {
  const [addColumnModalShow, setAddColumnModalShow] = useState(false);
  const { boardId } = useParams();
  const navigate = useNavigate();
  const isTaskModalOpen = useTaskModalStore((state) => state.isTaskModalOpen);
  const closeTaskModal = useTaskModalStore((state) => state.closeTaskModal);
  const activeBoardId = boardId || "";
  const boards = useBoardStore((state) => state.boards);
  const loadBoard = useBoardStore((state) => state.loadBoard);
  const addColumn = useBoardStore((state) => state.addColumn);
  const updateCard = useBoardStore((state) => state.updateCard);
  const addCard = useBoardStore((state) => state.addCard);
  const removeCard = useBoardStore((state) => state.removeCard);
  const subscribeRealtime = useBoardStore((state) => state.subscribeRealtime);
  const unsubscribeRealtime = useBoardStore(
    (state) => state.unsubscribeRealtime
  );
  const loading = useBoardStore((state) => state.loading);

  useEffect(() => {
    if (!activeBoardId) {
      return;
    }
    loadBoard(activeBoardId);
    subscribeRealtime(activeBoardId);

    return () => unsubscribeRealtime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBoardId]);

  console.log("dashboard");

  useEffect(() => {
    syncTaskModalWithUrl();
    syncTaskDrawerWithUrl();

    const handleHashChange = () => {
      syncTaskModalWithUrl();
      syncTaskDrawerWithUrl();
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (!boards.length) return;
    if (
      !activeBoardId ||
      !boards.some((board: { id: string }) => board.id === activeBoardId)
    ) {
      navigate(`/${boards[0].id}`, { replace: true });
    }
  }, [activeBoardId, boards, navigate]);

  const handleAddColumn = (name: string, color: string) => {
    addColumn(activeBoardId, name, color);
  };

  return (
    <>
      {loading ? (
        <BoardLoader />
      ) : (
        <>
          <TaskDrawer
            createTask={addCard}
            editTask={updateCard}
            deleteTask={removeCard}
          />

          <Container fluid>
            {boards.length ? (
              <>
                <DashboardTopBar
                  openAddColumnModal={() => setAddColumnModalShow(true)}
                />

                <div className="mt-3">
                  <DashboardColumns />
                </div>
              </>
            ) : (
              <DashboardInitHeader />
            )}
          </Container>
        </>
      )}

      <AddColumnModal
        show={addColumnModalShow}
        onHide={() => setAddColumnModalShow(false)}
        onSave={handleAddColumn}
      />

      <TaskModal show={isTaskModalOpen} onHide={closeTaskModal} />

      <TimerWithConfirmDialog />
    </>
  );
}

function TimerWithConfirmDialog() {
  const [confirmLogTimeShow, setConfirmLogTimeShow] = useState(false);
  const setTimeToLog = useTimerStore((state) => state.setTimeToLog);
  const timeToLog = useTimerStore((state) => state.timeToLog);
  const isTimerShow = useTimerStore((state) => state.isTimerShow);
  const clearActiveTaskId = useTimerStore((state) => state.clearActiveTaskId);
  const setLogTime = useBoardStore((state) => state.setLogTime);

  const handleLogTime = () => {
    if (timeToLog) setLogTime(timeToLog.taskId, timeToLog.time);
    clearActiveTaskId();
    setConfirmLogTimeShow(false);
  };

  const handleStopTimer = (taskId: string, time: number) => {
    setTimeToLog(taskId, time);
    setConfirmLogTimeShow(true);
  };

  return (
    <>
      <ConfirmModal
        show={confirmLogTimeShow}
        onHide={() => {
          clearActiveTaskId();
          setConfirmLogTimeShow(false);
        }}
        onConfirm={handleLogTime}
        title="Log time"
        confirmBtnText="Log Time"
        btnVariant="success"
        message={`Do you want to log time? (${formatTime(
          timeToLog?.time as number,
          true
        )} )`}
      />
      <Timer show={isTimerShow} onFinish={handleStopTimer} />
    </>
  );
}
