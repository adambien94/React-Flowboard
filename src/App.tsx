import "bootstrap/dist/css/bootstrap.min.css";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import FullPageLoader from "./components/FullPageLoader";

const Login = lazy(() => import("./Login"));
const Dashboard = lazy(() => import("./Dashboard"));
const Summary = lazy(() => import("./Summary"));

export default function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
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
          <Route path="summary/:boardId" element={<Summary />} />
          <Route path="*" element={<h2>Page not found</h2>} />
        </Route>
      </Routes>
    </Suspense>
  );
}
