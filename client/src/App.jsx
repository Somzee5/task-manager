// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import SpocDashboard from "./pages/SpocDashboard";
import EngineerDashboard from "./pages/EngineerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard/spoc"
        element={
          <ProtectedRoute allowedRole="spoc">
            <SpocDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/engineer"
        element={
          <ProtectedRoute allowedRole="design_engg">
            <EngineerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
