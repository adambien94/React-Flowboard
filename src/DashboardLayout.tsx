import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Drawer from "./components/Drawer";
import styles from "./components/dashboard/DashboardLayout.module.css";
import { BoardsProvider } from "./contexts/BoardsContext";
import AddBoardModal from "./components/AddBoardModal";
import { useUiStore } from "./store/useUiStore";
import { useBoardStore } from "./store/useBoardStore";

export default function DashboardLayout() {
  const [drawerShow, setDrawerShow] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const addBoard = useBoardStore((state) => state.addBoard);
  const isCreateBoardModalOpen = useUiStore(
    (state) => state.isCreateBoardModalOpen
  );
  const closeCreateBoardModal = useUiStore(
    (state) => state.closeCreateBoardModal
  );

  const handleToggleDrawer = () => {
    setDrawerShow(!drawerShow);
  };

  const handleHideDrawer = () => {
    setDrawerShow(false);
  };

  return (
    <BoardsProvider>
      <Navbar onToggleDrawer={handleToggleDrawer} />
      <Drawer show={drawerShow} onHide={handleHideDrawer} />
      <div
        className={`${styles.mainContent} ${
          drawerShow ? styles.drawerOpen : ""
        }`}
      >
        <Outlet />
      </div>
      <AddBoardModal
        show={isCreateBoardModalOpen}
        onHide={closeCreateBoardModal}
        onSave={async (title) => {
          const newBoardId = await addBoard(title);
          closeCreateBoardModal();

          if (!newBoardId) {
            return;
          }

          const isSummaryMode = location.pathname.startsWith("/summary/");
          navigate(isSummaryMode ? `/summary/${newBoardId}` : `/${newBoardId}`);
        }}
      />
    </BoardsProvider>
  );
}
