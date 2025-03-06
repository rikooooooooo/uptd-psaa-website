import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../authContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated()); // Debugging

  return isAuthenticated() ? children : <Navigate to="/logadminpsaa" />;
}

export default ProtectedRoute;