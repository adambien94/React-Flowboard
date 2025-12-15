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
import { usePersistentTimerStore } from "./store/timerStore";
import ConfirmModal from "./components/ConfirmModal";
import formatTime from "./utils/formatTime";
import { useBoardStore } from "./hooks/useBoardStore";
import BoardLoader from "./components/dashboard/BoardLoader";
import { useTaskModalStore } from "./store/taskModalStore";
import { syncTaskModalWithUrl } from "./store/taskModalStore";
import { syncTaskDrawerWithUrl } from "./store/taskDrawerStore";

export default function Dashboard() {
  const [addColumnModalShow, setAddColumnModalShow] = useState(false);
  const [confirmLogTimeShow, setConfirmLogTimeShow] = useState(false);
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { setTimeToLog, timeToLog, isTimerShow, clearActiveTaskId } =
    usePersistentTimerStore();
  const { isTaskModalOpen, closeTaskModal } = useTaskModalStore();
  const activeBoardId = boardId || "";
  const {
    boards,
    loadBoard,
    addColumn,
    updateCard,
    addCard,
    removeCard,
    subscribeRealtime,
    unsubscribeRealtime,
    loading,
    setLogTime,
  } = useBoardStore();

  useEffect(() => {
    if (!activeBoardId) {
      return;
    }
    loadBoard(activeBoardId);
    subscribeRealtime(activeBoardId);

    return () => unsubscribeRealtime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBoardId]);

  // console.log("dashboard");

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
    if (!activeBoardId || !boards.some((board) => board.id === activeBoardId)) {
      navigate(`/${boards[0].id}`, { replace: true });
    }
  }, [activeBoardId, boards, navigate]);

  const handleLogTime = () => {
    if (timeToLog) setLogTime(timeToLog.taskId, timeToLog.time);
    clearActiveTaskId();
    setConfirmLogTimeShow(false);
  };

  const handleStopTimer = (taskId: string, time: number) => {
    setTimeToLog(taskId, time);
    setConfirmLogTimeShow(true);
  };

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

      <ConfirmModal
        show={confirmLogTimeShow}
        onHide={() => setConfirmLogTimeShow(false)}
        onConfirm={handleLogTime}
        title="Log time"
        confirmBtnText="Log Time"
        btnVariant="success"
        message={`Do you want to log time? (${formatTime(
          timeToLog?.time as number,
          true
        )} )`}
      />

      <AddColumnModal
        show={addColumnModalShow}
        onHide={() => setAddColumnModalShow(false)}
        onSave={handleAddColumn}
      />

      <TaskModal show={isTaskModalOpen} onHide={closeTaskModal} />

      <Timer show={isTimerShow} onFinish={handleStopTimer} />
    </>
  );
}
