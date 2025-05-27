import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

const AssignedTaskTable = ({ tasks, refreshTasks }) => {
  // Function to determine status color and text (consistent with SPOC view)
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

  const handleUpdateTask = async (taskId, field, value) => {
    try {
      const token = localStorage.getItem("token");
      const updateData = { [field]: value };

      // Special handling for status update:
      // If 'isCleared' is true, set status to 'completed'
      // If 'startDate' is set, set status to 'in progress' if not already completed
      // Otherwise, keep as 'pending' or existing status
      if (field === 'isCleared') {
        updateData.isCleared = value;
        if (value === true) {
          updateData.status = 'completed';
        } else if (value === false && tasks.find(t => t._id === taskId)?.status === 'completed') {
            // If they un-clear a completed task, revert status to in progress or pending
            updateData.status = tasks.find(t => t._id === taskId)?.startedAt ? 'in progress' : 'pending';
        }
      } else if (field === 'startDate' && value && tasks.find(t => t._id === taskId)?.status === 'pending') {
          updateData.status = 'in progress';
      } else if (field === 'actualCompletion' && value && tasks.find(t => t._id === taskId)?.status !== 'completed') {
          // If actual completion is set, and it's not already completed, mark as in progress
          // The isCleared field should ultimately drive 'completed' status, so this might be redundant
          // but added for robustness.
          updateData.status = 'in progress';
      }


      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Task updated successfully!");
      refreshTasks(); // Refresh tasks in parent component to show updated data
    } catch (err) {
      console.error(`Failed to update task ${field}:`, err);
      toast.error(err.response?.data?.msg || `Could not update task ${field}.`);
    }
  };

  if (!tasks || tasks.length === 0) {
    return <p className="text-center text-gray-600 p-6">No tasks assigned to you yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm text-left">
        <thead className="bg-green-50 text-green-700 uppercase tracking-wider">
          <tr>
            <th className="p-3 border border-gray-300">Type of Work</th>
            <th className="p-3 border border-gray-300">ECN Number</th>
            <th className="p-3 border border-gray-300">Date Assigned</th>
            <th className="p-3 border border-gray-300">Project Description</th>
            <th className="p-3 border border-gray-300">Planned Completion</th>
            <th className="p-3 border border-gray-300">Start Date (Actual)</th>
            <th className="p-3 border border-gray-300">Actual Completion</th>
            <th className="p-3 border border-gray-300">PQC Approved</th>
            <th className="p-3 border border-gray-300">Hope/Cleared</th>
            <th className="p-3 border border-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3 border border-gray-300">{task.typeOfWork}</td>
              <td className="p-3 border border-gray-300">{task.ecnNumber}</td>
              <td className="p-3 border border-gray-300">
                {new Date(task.assignedAt).toLocaleDateString()}
              </td>
              <td className="p-3 border border-gray-300">{task.projectDescription}</td>
              <td className="p-3 border border-gray-300">
                {task.plannedCompletion ? new Date(task.plannedCompletion).toLocaleDateString() : 'N/A'}
              </td>
              <td className="p-3 border border-gray-300">
                <input
                  type="date" // Use type="date" for date picker
                  value={task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleUpdateTask(task._id, 'startDate', e.target.value)}
                  className="border px-2 py-1 rounded text-xs w-28"
                />
              </td>
              <td className="p-3 border border-gray-300">
                <input
                  type="date"
                  value={task.actualCompletion ? new Date(task.actualCompletion).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleUpdateTask(task._id, 'actualCompletion', e.target.value)}
                  className="border px-2 py-1 rounded text-xs w-28"
                />
              </td>
              <td className="p-3 border border-gray-300">
                <input
                  type="checkbox"
                  checked={task.pqcApproved || false} // Ensure it's a boolean
                  onChange={(e) => handleUpdateTask(task._id, 'pqcApproved', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                />
              </td>
              <td className="p-3 border border-gray-300">
                <select
                  value={task.isCleared ? "Cleared" : "Hope"}
                  onChange={(e) =>
                    handleUpdateTask(task._id, 'isCleared', e.target.value === "Cleared")
                  }
                  className="border px-2 py-1 rounded text-xs"
                >
                  <option value="Hope">Hope</option>
                  <option value="Cleared">Cleared</option>
                </select>
              </td>
              <td className="p-3 border border-gray-300">
                {getStatusDisplay(task.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedTaskTable;