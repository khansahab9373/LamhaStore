import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== MUI ALERT STATE ===== */
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity });
  };

  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/users/login", {
        email,
        password,
      });

      login(data);
      showAlert("Login successful", "success");
      navigate("/");
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Invalid email or password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== MUI SNACKBAR ALERT ===== */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <div
        className="min-h-screen flex items-center justify-center px-4
        bg-gray-100 dark:bg-black transition-colors"
      >
        <div
          className="w-full max-w-md
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          rounded-2xl shadow-xl
          p-6 md:p-8 space-y-6"
        >
          <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100">
            Welcome Back
          </h1>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Login to continue shopping
          </p>

          <form onSubmit={submitHandler} className="space-y-5">
            {/* EMAIL */}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl
              bg-transparent
              text-gray-900 dark:text-gray-100
              border border-gray-300 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl
              bg-transparent
              text-gray-900 dark:text-gray-100
              border border-gray-300 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl font-semibold transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold underline text-gray-900 dark:text-gray-100"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
