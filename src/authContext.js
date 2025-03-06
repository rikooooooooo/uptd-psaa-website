import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (identifier, password, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? "http://localhost:5000/login" : "http://localhost:5000/loginUsers";

      // Prepare the request body based on the login type
      const requestBody = isAdmin
        ? { email: identifier, password } // Admin login: email and password
        : { username: identifier, password }; // User login: username and password

      const response = await axios.post(endpoint, requestBody);

      const { user, token } = response.data;

      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));

      if (isAdmin && token) {
        localStorage.setItem("token", token); // Store token for admin
      }

      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    console.log("Logging out..."); // Debugging
    setCurrentUser(null);
    localStorage.removeItem("currentUser"); // Clear persisted user data
    localStorage.removeItem("token"); // Clear persisted token
    window.location.href = "/"; // Redirect to home
  };

  // Check if the user is authenticated
  const isAuthenticated = () => {
    console.log("Checking authentication...", !!currentUser); // Debugging
    return !!currentUser;
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}