// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import SpocDashboard from "./pages/SpocDashboard";
import EngineerDashboard from "./pages/EngineerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DelayedRender from "./components/Loader/DelayedRender.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DelayedRender><Login /></DelayedRender>} />
      <Route path="/signup" element={<DelayedRender><Signup /></DelayedRender>} />
      <Route
        path="/dashboard/spoc"
        element={
          <ProtectedRoute allowedRole="spoc">
            <DelayedRender><SpocDashboard /></DelayedRender>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/engineer"
        element={
          <ProtectedRoute allowedRole="design_engg">
            <DelayedRender><EngineerDashboard /></DelayedRender>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
