import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import AssignedTaskTable from "../components/Dashboards/Engineer/AssignedTaskTable";
import MetricsCard from "../components/Dashboards/Engineer/MetricsCard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EngineerDashboard = () => {
  const { user, logout } = useUser(); // Get user details and logout function
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [errorTasks, setErrorTasks] = useState(null);
  const [errorMetrics, setErrorMetrics] = useState(null);

  // Function to fetch tasks for the engineer
  const fetchEngineerTasks = async () => {
    try {
      setLoadingTasks(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorTasks("No authentication token found. Please log in.");
        toast.error("No authentication token found. Please log in.");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/tasks/engineer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch engineer tasks:", err);
      setErrorTasks(
        err.response?.data?.msg ||
          "An error occurred while fetching your tasks. Please try again."
      );
      toast.error(err.response?.data?.msg || "Failed to load your tasks!");
    } finally {
      setLoadingTasks(false);
    }
  };

  // Function to fetch engineer metrics
  const fetchEngineerMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMetrics("No authentication token found for metrics. Please log in.");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/tasks/engineer/metrics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMetrics(res.data);
    } catch (err) {
      console.error("Failed to fetch engineer metrics:", err);
      setErrorMetrics(
        err.response?.data?.msg ||
          "An error occurred while fetching your metrics. Please try again."
      );
      toast.error(err.response?.data?.msg || "Failed to load your metrics!");
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchEngineerTasks();
    fetchEngineerMetrics();
  }, []); // Run on component mount

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Engineer Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200 ease-in-out"
        >
          Logout
        </button>
      </div>

      {user && (
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Welcome, {user.name || user.email}! Here are your assigned tasks and metrics.
        </h2>
      )}

      {/* Metrics Card Section */}
      <div className="mb-8">
        {loadingMetrics ? (
          <p className="text-gray-600">Loading metrics...</p>
        ) : errorMetrics ? (
          <p className="text-red-500">{errorMetrics}</p>
        ) : (
          <MetricsCard metrics={metrics} />
        )}
      </div>

      {/* Assigned Tasks Table Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-2xl font-semibold mb-4 text-green-800">Your Assigned Tasks</h3>
        {loadingTasks ? (
          <p className="text-gray-600">Loading tasks...</p>
        ) : errorTasks ? (
          <p className="text-red-500">{errorTasks}</p>
        ) : (
          <AssignedTaskTable tasks={tasks} refreshTasks={fetchEngineerTasks} />
        )}
      </div>
    </div>
  );
};

export default EngineerDashboard;