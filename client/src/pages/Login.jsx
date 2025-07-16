import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/backenInt";
import logo from "../assets/Logo.jpg";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleSubmit = async () => {
  try {
    const apiCall = isLogin ? loginUser : registerUser;
    const res = await apiCall({ username, password });

    localStorage.setItem("username", res.data.user.username);
    localStorage.setItem("token", res.data.token); 
    localStorage.setItem("userId", res.data.user._id); 
  


    navigate("/rooms"); // Redirect to the room selector
  } catch (err) {
    console.error("Auth failed", err);
  }
};

  return (
    <div className="min-h-screen bg-gray-300 text-pink-500 relative">
        <div className="absolute top-4 right-4">
        <img src={logo} alt="Logo" className="w-20 h-20 rounded-full shadow" />
      </div>

      <div className="text-center pt-8">
        <h1 className="text-4xl font-bold">Welcome to Convo Cloud ☁️</h1>
        <p className="text-sm text-pink-500">Connect. Chat. React in Real-Time.</p>
      </div>

      {/* Card */}
      <div className="flex justify-center items-center h-[75vh]">
        <div className="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center">
            {isLogin ? "Login" : "Create "}
          </h2>

          <input
            className="w-full border p-2 rounded"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-gray-600"
          >
            {isLogin ? "Log In" : "Register"}
          </button>

          {/* Toggle Login/Register */}
          <p className="text-center text-sm mt-2">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-pink-500 underline"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-pink-500 underline"
                >
                  Log In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
