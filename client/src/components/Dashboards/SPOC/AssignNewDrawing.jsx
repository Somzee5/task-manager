import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toastify

const AssignNewDrawing = () => {
  const [formData, setFormData] = useState({
    typeOfWork: "",
    ecnNumber: "",
    date: "",
    projectDescription: "",
    assignee: "",
  });

  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  // Fetch list of engineers
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
        toast.error("Failed to fetch engineers."); // Show error toast
      }
    };

    fetchEngineers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on submission

    try {
      await axios.post("http://localhost:5000/api/tasks", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Task assigned successfully!"); // Success toast

      // Reset form
      setFormData({
        typeOfWork: "",
        ecnNumber: "",
        date: "",
        projectDescription: "",
        assignee: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign task."); // Error toast
    } finally {
      setLoading(false); // Set loading back to false
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-4 border rounded shadow max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-blue-700">Assign New Drawing</h2>

      <input
        type="text"
        name="typeOfWork"
        placeholder="Type of Work"
        value={formData.typeOfWork}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="text"
        name="ecnNumber"
        placeholder="ECN Number"
        value={formData.ecnNumber}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <textarea
        name="projectDescription"
        placeholder="Project Description"
        value={formData.projectDescription}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <select
        name="assignee"
        value={formData.assignee}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      >
        <option value="">-- Assign to Engineer --</option>
        {engineers.map((eng) => (
          <option key={eng._id} value={eng._id}>
            {eng.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:opacity-50"
        disabled={loading} // Disable button when loading
      >
        {loading ? "Assigning..." : "Assign"}
      </button>
    </form>
  );
};

export default AssignNewDrawing;