import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Drawer from "./components/Drawer";
import styles from "./components/DashboardLayout.module.css";

export default function DashboardLayout() {
  const [showDrawer, setShowDrawer] = useState(true);

  const handleToggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  const handleHideDrawer = () => {
    setShowDrawer(false);
  };

  return (
    <>
      <Navbar onToggleDrawer={handleToggleDrawer} />
      <Drawer show={showDrawer} onHide={handleHideDrawer} />
      <div
        className={`${styles.mainContent} ${
          showDrawer ? styles.drawerOpen : ""
        }`}
      >
        <Outlet />
      </div>
    </>
  );
}
