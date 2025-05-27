// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import SpocDashboard from "./pages/SpocDashboard";
import EngineerDashboard from "./pages/EngineerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DelayedRender from "./components/Loader/DelayedRender.jsx";

function App() {
  return (
    <>
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
      {/* ToastContainer rendered here */}
      <ToastContainer
        position="top-right" // You can change the position (e.g., "top-center", "bottom-left")
        autoClose={3000} // How long the toast stays visible in milliseconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;