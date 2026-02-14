
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";








const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [timeLeft, setTimeLeft] = useState(120); // 2 min
  const [timerActive, setTimerActive] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ===== ALERT ===== */
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

  /* ================= REGISTER ================= */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/register", {
        name,
        email,
        password,
      });

      setOtpSent(true);
      setTimeLeft(120);
      setTimerActive(true);

      showAlert("OTP sent to your email", "success");
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Registration failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtpHandler = async () => {
    if (!otp) {
      showAlert("Please enter OTP", "error");
      return;
    }

    try {
      await api.post("/users/verify-otp", {
        email,
        otp,
      });

      showAlert("OTP verified successfully", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Invalid or expired OTP",
        "error"
      );
    }
  };

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft === 0) {
      setTimerActive(false);
      showAlert("OTP expired. Please register again.", "error");
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, timerActive]);

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>

      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-black">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border rounded-2xl p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center">
            {otpSent ? "Verify OTP" : "Create Account"}
          </h1>

          {!otpSent ? (
            <form onSubmit={submitHandler} className="space-y-4">
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded"
              />

              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded"
              />

              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded"
              />

              <input
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded"
              />

              <button
                disabled={loading}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded font-semibold transition disabled:opacity-60 hover:opacity-90"
              >
                {loading ? "Sending OTP..." : "Register"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />

              <p className="text-center text-sm">
                OTP expires in{" "}
                {Math.floor(timeLeft / 60)}:
                {String(timeLeft % 60).padStart(2, "0")}
              </p>

              <button
                onClick={verifyOtpHandler}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Verify OTP
              </button>
              <button
  onClick={async () => {
    try {
      await api.post("/users/resend-otp", { email });
      showAlert("OTP resent to your email", "success");
      setTimeLeft(120);
      setTimerActive(true);
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Failed to resend OTP",
        "error"
      );
    }
  }}
  className="w-full border py-2 rounded"
>
  Resend OTP
</button>

            </div>
          )}

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;






// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../services/api";

// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";

// const Register = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [loading, setLoading] = useState(false);

//   /* ===== MUI ALERT STATE ===== */
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const showAlert = (message, severity = "success") => {
//     setAlert({ open: true, message, severity });
//   };

//   const closeAlert = () => {
//     setAlert({ ...alert, open: false });
//   };

//   /* ================= REGISTER ================= */
//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       showAlert("Passwords do not match", "error");
//       return;
//     }

//     setLoading(true);

//     try {
//       await api.post("/users/register", {
//         name,
//         email,
//         password,
//       });

//       showAlert("Account created successfully. Please login.", "success");

//       setTimeout(() => {
//         navigate("/login");
//       }, 1200);
//     } catch (err) {
//       showAlert(
//         err.response?.data?.message || "Registration failed",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* ===== MUI SNACKBAR ALERT ===== */}
//       <Snackbar
//         open={alert.open}
//         autoHideDuration={4000}
//         onClose={closeAlert}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={closeAlert}
//           severity={alert.severity}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {alert.message}
//         </Alert>
//       </Snackbar>

//       <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-black">
//         <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-6 shadow-md">
//           <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
//             Create Account
//           </h1>

//           <form onSubmit={submitHandler} className="space-y-4">
//             <input
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             <input
//               placeholder="Email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             <input
//               placeholder="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             <input
//               placeholder="Confirm Password"
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             <button
//               disabled={loading}
//               className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded font-semibold transition disabled:opacity-60 hover:opacity-90"
//             >
//               {loading ? "Creating account..." : "Register"}
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-600 dark:text-gray-400">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className="font-semibold underline text-gray-900 dark:text-gray-100"
//             >
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Register;










// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../services/api";

// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";

// const Register = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);

//   const [timeLeft, setTimeLeft] = useState(0);
//   const [timerActive, setTimerActive] = useState(false);

//   const [loading, setLoading] = useState(false);

//   /* ===== MUI ALERT STATE ===== */
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const showAlert = (message, severity = "success") => {
//     setAlert({ open: true, message, severity });
//   };

//   const closeAlert = () => {
//     setAlert({ ...alert, open: false });
//   };

 

 
  
//   /* ================= REGISTER ================= */
//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       showAlert("Passwords do not match", "error");
//       return;
//     }

//     setLoading(true);

//     try {

//        // 🔥 STEP 1: BACKEND REGISTER (OTP DB me save hoga)
//   await api.post("/users/register", {
//     name,
//     email,
//     password,
//   });
//       await sendOtp();
//       showAlert("OTP sent to your email", "success");
//     } catch (err) {
//       console.error(err);
//       showAlert("Failed to send OTP", "error");
//     } finally {
//       setLoading(false);
//     }
//   };







//   /* ================= VERIFY OTP ================= */
//  const verifyOtpHandler = async () => {
//   if (!otp) {
//     showAlert("Please enter OTP", "error");
//     return;
//   }

//   setTimerActive(false);
//   setTimeLeft(0);

//   try {
//     // ✅ BACKEND OTP VERIFY
//     await api.post("/users/verify-otp", {
//       email,
//       otp,
//     });

//     // ✅ WELCOME EMAIL (AS IT IS)
//     await emailjs.send(
//       import.meta.env.VITE_EMAILJS_SERVICE_ID,
//       import.meta.env.VITE_EMAILJS_WELCOME_TEMPLATE_ID,
//       { name, email },
//       import.meta.env.VITE_EMAILJS_PUBLIC_KEY
//     );

//     showAlert(
//       "Account verified successfully. Please login.",
//       "success"
//     );

//     setTimeout(() => {
//       navigate("/login");
//     }, 1500);
//   } catch (err) {
//     showAlert(
//       err.response?.data?.message || "Invalid or expired OTP",
//       "error"
//     );
//   }
// };








//   useEffect(() => {
//     if (!timerActive) return;

//     if (timeLeft === 0) {
//       setTimerActive(false);
//       showAlert("OTP expired. Please resend.", "error");
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeLeft, timerActive]);

//   return (
//     <>
//       {/* ===== MUI SNACKBAR ALERT ===== */}
//       <Snackbar
//         open={alert.open}
//         autoHideDuration={4000}
//         onClose={closeAlert}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={closeAlert}
//           severity={alert.severity}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {alert.message}
//         </Alert>
//       </Snackbar>

//       <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-black">
//         <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-6 shadow-md">
//           <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
//             {otpSent ? "Verify OTP" : "Create Account"}
//           </h1>

//           {!otpSent ? (
//             <form onSubmit={submitHandler} className="space-y-4">
//               <input
//                 placeholder="Full Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//               <input
//                 placeholder="Email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//               <input
//                 placeholder="Password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//               <input
//                 placeholder="Confirm Password"
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//               <button
//                 disabled={loading}
//                 className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded font-semibold transition disabled:opacity-60 hover:opacity-90"
//               >
//                 {loading ? "Sending OTP..." : "Register"}
//               </button>
//             </form>
//           ) : (
//             <div className="space-y-4">
//               <input
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//               {timerActive && (
//                 <p className="text-center text-sm text-gray-500">
//                   OTP expires in{" "}
//                   <span className="font-semibold">
//                     {Math.floor(timeLeft / 60)}:
//                     {String(timeLeft % 60).padStart(2, "0")}
//                   </span>
//                 </p>
//               )}

//               <button
//                 onClick={verifyOtpHandler}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
//               >
//                 Verify OTP
//               </button>

//               {/* ✅ UPDATED RESEND OTP BUTTON */}
//               <button
//                 onClick={() => sendOtp(true)}
//                 className="
//                   w-full py-2 text-sm font-semibold
//                   text-blue-600 dark:text-blue-400
//                   border border-blue-600 dark:border-blue-400
//                   rounded-xl
//                   hover:bg-blue-600 hover:text-white
//                   dark:hover:bg-blue-400 dark:hover:text-black
//                   transition-all duration-200
//                 "
//               >
//                 Resend OTP
//               </button>
//             </div>
//           )}

//           <p className="text-center text-sm text-gray-600 dark:text-gray-400">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className="font-semibold underline text-gray-900 dark:text-gray-100"
//             >
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Register;

