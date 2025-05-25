import { useUser } from "../context/UserContext";

const EngineerDashboard = () => {
  const { logout } = useUser();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Engineer Dashboard</h1>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default EngineerDashboard;
