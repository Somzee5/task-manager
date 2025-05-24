import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SpocDashboard from "./pages/SpocDashboard.jsx";
import EngineerDashboard from "./pages/EngineerDashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route
        path="/dashboard/spoc"
        element={
          <ProtectedRoute role="spoc">
            <SpocDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/engineer"
        element={
          <ProtectedRoute role="engineer">
            <EngineerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
