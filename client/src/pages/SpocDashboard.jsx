import { useState } from "react"; // Import useState
import { useUser } from "../context/UserContext";
import AssignNewDrawing from "../components/Dashboards/SPOC/AssignNewDrawing";
import TaskTable from "../components/Dashboards/SPOC/TaskTable";
import { ToastContainer } from 'react-toastify';

const SpocDashboard = () => {
  const { logout } = useUser();
  const [showAssignForm, setShowAssignForm] = useState(false); // State to control form visibility

  const handleTaskAssigned = () => {
    setShowAssignForm(false); // Hide the form after a task is assigned
    // You might want to trigger a refresh of the TaskTable here if needed
    // (e.g., by passing a prop to TaskTable or using a shared state/context for task list)
  };

  return (
    <div className="p-4">
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

      {/* Header and buttons at the top */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">SPOC Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowAssignForm(!showAssignForm)} // Toggle form visibility
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            {showAssignForm ? "Hide Assign Form" : "Assign New Task"}
          </button>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Conditional rendering of the Assign New Drawing form */}
      {showAssignForm && <AssignNewDrawing onTaskAssigned={handleTaskAssigned} />}

      {/* Task table at the bottom */}
      <div className="mt-8"> {/* Added margin top for spacing */}
        <TaskTable />
      </div>
    </div>
  );
};

export default SpocDashboard;