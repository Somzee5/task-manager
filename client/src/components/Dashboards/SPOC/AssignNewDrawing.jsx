import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Accept onTaskAssigned as a prop
const AssignNewDrawing = ({ onTaskAssigned }) => {
  const [formData, setFormData] = useState({
    typeOfWork: "",
    ecnNumber: "",
    date: "", // Or assignedAt, as discussed
    projectDescription: "",
    assignee: "",
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
      await axios.post("http://localhost:5000/api/tasks", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Task assigned successfully!");
      setFormData({
        typeOfWork: "",
        ecnNumber: "",
        date: "",
        projectDescription: "",
        assignee: "",
      });

      // ⭐ Call the callback function to hide the form or trigger table refresh
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
      className="p-6 space-y-4 border rounded-lg shadow-lg max-w-xl mx-auto bg-gray-50 mb-8" // Added shadow and margin-bottom
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

      <label htmlFor="assignedDate" className="block text-sm font-medium text-gray-700">
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
      />

      <textarea
        name="projectDescription"
        placeholder="Project Description"
        value={formData.projectDescription}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
        rows="3" // Added rows for better textarea appearance
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
            {eng.name} ({eng.email}) {/* Showing name and email for clarity */}
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