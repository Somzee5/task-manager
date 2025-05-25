import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SpocDashboard from "./pages/SpocDashboard.jsx";
import EngineerDashboard from "./pages/EngineerDashboard.jsx";
import DelayedRender from "./components/Loader/DelayedRender.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DelayedRender><Login /></DelayedRender>} />
      <Route path="/signup" element={<DelayedRender><Signup /></DelayedRender>} />

      <Route
        path="/dashboard/spoc"
        element={
          <ProtectedRoute role="spoc">
            <DelayedRender>
              <SpocDashboard />
            </DelayedRender>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/engineer"
        element={
          <ProtectedRoute role="design_engg">
            <DelayedRender>
              <EngineerDashboard />
            </DelayedRender>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
