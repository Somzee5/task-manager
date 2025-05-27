import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          toast.error("No authentication token found. Please log in.");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/tasks/spoc", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError(
          err.response?.data?.msg ||
            "An error occurred while fetching tasks. Please try again."
        );
        toast.error(err.response?.data?.msg || "Failed to load tasks!");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Function to determine status color and text
  const getStatusDisplay = (status) => {
    let colorClass = "";
    let displayText = "";

    switch (status) {
      case "pending":
        colorClass = "bg-yellow-400";
        displayText = "Pending";
        break;
      case "in progress":
        colorClass = "bg-blue-400";
        displayText = "In Progress";
        break;
      case "completed":
        colorClass = "bg-green-500";
        displayText = "Completed";
        break;
      default:
        colorClass = "bg-gray-400";
        displayText = "Unknown";
    }
    return (
      <span className="flex items-center">
        <span className={`h-2.5 w-2.5 rounded-full ${colorClass} mr-2`}></span>
        {displayText}
      </span>
    );
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error(err.response?.data?.msg || "Could not delete task!");
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' ||
      task.ecnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.projectDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === '' || task.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <p className="mt-4">Loading tasks...</p>;
  if (error) return <p className="mt-4 text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Assigned Tasks (SPOC View)</h2>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by ECN, Assignee, Description..."
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-sm text-left">
        <thead className="bg-blue-50 text-blue-700 uppercase tracking-wider">
          <tr>
            <th className="p-3 border border-gray-300">Type of Work</th>
            <th className="p-3 border border-gray-300">ECN Number</th>
            <th className="p-3 border border-gray-300">Date Assigned</th>
            <th className="p-3 border border-gray-300">Project Description</th>
            <th className="p-3 border border-gray-300">Assignee</th>
            <th className="p-3 border border-gray-300">Status</th>
            {/* Removed Hope/Cleared column from SPOC's view */}
            <th className="p-3 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              {/* Adjusted colspan since "Hope/Cleared" column is removed */}
              <td colSpan="7" className="text-center p-6 text-gray-500 bg-gray-50">
                No tasks found matching your criteria.
              </td>
            </tr>
          ) : (
            filteredTasks.map((task) => (
              <tr key={task._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 border border-gray-300">{task.typeOfWork}</td>
                <td className="p-3 border border-gray-300">{task.ecnNumber}</td>
                <td className="p-3 border border-gray-300">
                  {new Date(task.assignedAt).toLocaleString()}
                </td>
                <td className="p-3 border border-gray-300">{task.projectDescription}</td>
                <td className="p-3 border border-gray-300">{task.assignee?.email || "—"}</td>
                <td className="p-3 border border-gray-300">
                  {getStatusDisplay(task.status)}
                </td>
                {/* Removed Hope/Cleared field from each row */}
                <td className="p-3 border border-gray-300">
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs transition duration-200 ease-in-out"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;