import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("spoc"); // default role
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "spoc") navigate("/dashboard/spoc");
      else navigate("/dashboard/engineer");

    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
        {/* Background Illustration */}
        <h1 className="text-white text-4xl font-bold">Create Account</h1>
      </div>

      <div className="w-1/2 flex items-center justify-center bg-white">
        <form onSubmit={handleSignup} className="w-[80%] max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-blue-700">Join Us!</h2>

          <input
            type="text"
            placeholder="name"
            className="w-full border px-4 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="email"
            className="w-full border px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="password"
            className="w-full border px-4 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="w-full border px-4 py-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="spoc">SPOC</option>
            <option value="design_engg">Design Engineer</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
          >
            Sign Up →
          </button>

          <p className="text-sm text-center">
            Already have an account? <a href="/" className="text-blue-600">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}
