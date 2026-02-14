import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // 🔄 Jab tak auth load ho raha hai
  if (loading) {
    return <div>Loading...</div>;
  }

  // ❌ Login nahi hai
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ❌ Admin nahi hai
  if (!user.isAdmin) {
    return <Navigate to="/" />;
  }

  // ✅ Admin allowed
  return children;
};

export default AdminRoute;
