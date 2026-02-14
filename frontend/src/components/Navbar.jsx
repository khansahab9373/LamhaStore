import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import AnalogWatch from "../components/AnalogWatch";

// Lucide Icons
import {
  Sun,
  Moon,
  ShoppingCart,
  User,
  LogOut,
  Shield,
  Search,
} from "lucide-react";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/?q=${keyword}` : "/");
    setKeyword("");
  };

  const handleLogoutConfirm = () => {
    logout();
    setOpenLogoutDialog(false);
    navigate("/login");
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50 h-16 bg-white dark:bg-black
           border-b border-slate-200 dark:border-slate-800
           shadow-lg dark:shadow-lg"
      >
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <h1
                className="
    text-2xl font-extrabold tracking-tight
    bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500
    bg-clip-text text-transparent

    transition-all duration-200
    hover:drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]
    dark:hover:drop-shadow-[0_1px_1px_rgba(255,255,255,0.25)]
  "
              >
                LamhaStore
              </h1>
            </Link>

            <div
              className="
  hidden sm:flex items-center justify-center
  w-14 h-14
  rounded-full
  bg-white dark:bg-black
  shadow-md
  ring-1 ring-slate-200 dark:ring-slate-700
"
            >
              <AnalogWatch />
            </div>
          </div>

          {/* SEARCH */}
          <form
            onSubmit={submitHandler}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg
              bg-slate-100 dark:bg-slate-900
              border border-slate-300 dark:border-slate-700"
          >
            <Search size={16} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-transparent outline-none text-sm w-48
                text-slate-900 dark:text-slate-200 placeholder-slate-500"
            />
          </form>

          {/* RIGHT */}
          <div className="flex items-center gap-4 text-sm font-medium">
            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-slate-300 dark:border-slate-700
                hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link
              to="/cart"
              className="relative flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Cart</span>
              <span className="absolute -top-2 -right-2 text-xs bg-black dark:bg-white text-white dark:text-black px-1.5 rounded-full">
                {cartCount}
              </span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition"
                  >
                    <Shield size={16} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                <button
                  onClick={() => setOpenLogoutDialog(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md
                    bg-black text-white dark:bg-white dark:text-black
                    hover:opacity-80 transition"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-md
                    bg-black text-white dark:bg-white dark:text-black
                    hover:opacity-80 transition font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* LOGOUT DIALOG */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
