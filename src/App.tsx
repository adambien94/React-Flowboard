import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import DashboardLayout from "./DashboardLayout";
import Login from "./Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path=":boardId" element={<Dashboard />} />
        <Route path="*" element={<h2>Page not found</h2>} />
      </Route>
    </Routes>
  );
}
