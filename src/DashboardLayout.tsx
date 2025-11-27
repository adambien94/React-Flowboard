import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Drawer from "./components/Drawer";
import styles from "./components/DashboardLayout.module.css";
import { BoardsProvider } from "./contexts/BoardsContext";

export default function DashboardLayout() {
  const [drawerShow, setDrawerShow] = useState(true);

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
    </BoardsProvider>
  );
}
