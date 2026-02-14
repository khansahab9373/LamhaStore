import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // if loading, show loading indicator

  if (loading) {
    return <div>Loading...</div>;
  }

  //   if user logged in, show children
  if (user) {
    return children;
  }

  //   if not logged in, redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
