import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userContext = useUser(); // 💡 safer than destructuring directly
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      const userData = {
        token: res.data.token,
        role: res.data.user.role,
      };

      // Save in context if available, else fallback to localStorage
      if (userContext?.login) {
        userContext.login(userData);
      } else {
        // fallback if context isn't loaded properly
        localStorage.setItem("token", userData.token);
        localStorage.setItem("role", userData.role);
      }

      // Redirect based on role
      if (res.data.user.role === "spoc") navigate("/dashboard/spoc");
      else navigate("/dashboard/engineer");

    } catch (err) {
      alert(err?.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Welcome Back!</h1>
      </div>

      <div className="w-1/2 flex items-center justify-center bg-white">
        <form onSubmit={handleLogin} className="w-[80%] max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-blue-700">Hello!</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
          >
            Next →
          </button>
          <p className="text-sm text-center">
            Don’t have an account? <a href="/signup" className="text-blue-600">Create one</a>
          </p>
        </form>
      </div>
    </div>
  );
}
