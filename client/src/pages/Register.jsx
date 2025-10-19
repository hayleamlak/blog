import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/"); // Redirect to home page
    } catch (err) {
      console.error(err.response?.data);

      if (
        err.response?.data?.msg?.includes("already") ||
        err.response?.data?.errmsg?.includes("E11000")
      ) {
        setError("Username or email already exists. Try a different one.");
      } else if (
        err.response?.data?.msg?.includes("validation") ||
        err.response?.data?.msg?.includes("Password")
      ) {
        setError(err.response.data.msg || "Invalid input. Check your fields.");
      } else {
        setError(err.response?.data?.msg || "Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white shadow-md rounded-lg p-8 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Full Name"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Register
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
