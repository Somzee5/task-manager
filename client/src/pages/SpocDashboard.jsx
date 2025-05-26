import { useUser } from "../context/UserContext";
import AssignNewDrawing from "../components/Dashboards/SPOC/AssignNewDrawing";

const SpocDashboard = () => {
  const { logout } = useUser();

  return (
    <div className="p-4">
      
      <h1 className="text-xl font-bold">SPOC Dashboard</h1>
      <AssignNewDrawing />
      {/* We'll add <TaskTable /> below this in next step */}

      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default SpocDashboard;
