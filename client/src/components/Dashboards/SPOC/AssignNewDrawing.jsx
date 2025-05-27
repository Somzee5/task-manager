import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignNewDrawing = ({ onTaskAssigned }) => {
  const [formData, setFormData] = useState({
    typeOfWork: "",
    ecnNumber: "",
    // We will no longer need 'date' in formData state if it's auto-captured
    // Instead, it will be added directly to dataToSend in handleSubmit
    projectDescription: "",
    assignee: "",
    plannedCompletion: "",
  });

  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users?role=design_engg", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEngineers(res.data);
      } catch (err) {
        console.error("Error fetching engineers:", err);
        toast.error("Failed to fetch engineers.");
      }
    };
    fetchEngineers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the data object to send, automatically including the current date/time for assignedAt
      const dataToSend = {
        ...formData,
        assignedAt: new Date().toISOString(), // ⭐ Auto-capture current date and time
      };

      await axios.post("http://localhost:5000/api/tasks", dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Task assigned successfully!");
      // Reset form, no 'date' to reset anymore
      setFormData({
        typeOfWork: "",
        ecnNumber: "",
        projectDescription: "",
        assignee: "",
        plannedCompletion: "",
      });

      if (onTaskAssigned) {
        onTaskAssigned();
      }

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to assign task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-4 border rounded-lg shadow-lg max-w-xl mx-auto bg-gray-50 mb-8"
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Assign New Drawing</h2>

      <input
        type="text"
        name="typeOfWork"
        placeholder="Type of Work"
        value={formData.typeOfWork}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
        required
      />

      <input
        type="text"
        name="ecnNumber"
        placeholder="ECN Number"
        value={formData.ecnNumber}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
        required
      />

      {/* Removed the manual Date Assigned input field entirely */}
      {/* <label htmlFor="assignedDate" className="block text-sm font-medium text-gray-700">
        Date Assigned:
      </label>
      <input
        id="assignedDate"
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
        required
      /> */}
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Date Assigned:</span> Automatically set to current date and time upon submission.
      </p>


      <label htmlFor="plannedCompletionDate" className="block text-sm font-medium text-gray-700">
        Planned Completion Date:
      </label>
      <input
        id="plannedCompletionDate"
        type="date"
        name="plannedCompletion"
        value={formData.plannedCompletion}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
        required
      />

      <textarea
        name="projectDescription"
        placeholder="Project Description"
        value={formData.projectDescription}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
        rows="3"
        required
      />

      <select
        name="assignee"
        value={formData.assignee}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
        required
      >
        <option value="">-- Assign to Engineer --</option>
        {engineers.map((eng) => (
          <option key={eng._id} value={eng._id}>
            {eng.name} ({eng.email})
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out font-semibold"
        disabled={loading}
      >
        {loading ? "Assigning..." : "Assign Task"}
      </button>
    </form>
  );
};

export default AssignNewDrawing;