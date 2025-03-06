import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function UserLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Username and password are required!");
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password, false); // Ensure isAdmin is false
      toast.success("Login successful!");
      setTimeout(() => navigate("/pendaftaran"), 2000);
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Invalid username or password.";
            break;
          case 401:
            errorMessage = "Unauthorized. Please check your credentials.";
            break;
          case 500:
            errorMessage = "Server error. Try again later.";
            break;
          default:
            errorMessage = "An unexpected error occurred.";
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-400">
        <div className="bg-white p-10 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            User Login
          </h2>

          {/* Username Input */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            {isLoading ? <ClipLoader size={20} color="#ffffff" /> : "Login"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
}

export default UserLoginPage;