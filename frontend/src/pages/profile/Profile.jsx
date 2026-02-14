import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ProfileImageModal from "./ProfileImageModal";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";

// Icons
import {
  Home,
  ShoppingCart,
  Heart,
  HelpCircle,
  Package,
  Mail,
  User,
  Shield,
} from "lucide-react";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  // 🔐 Logout
  const handleLogout = () => {
    logout();
    showAlert("Logged out successfully", "info");
    navigate("/login");
  };

  // ❌ Delete account
  const handleDeleteAccount = async () => {
    try {
      await api.delete("/users/profile");
      showAlert("Account deleted successfully", "success");
      logout();
      navigate("/login");
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Failed to delete account",
        "error",
      );
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        {/* ===== HEADER ===== */}
        <div
          className="flex items-center gap-6 p-6 rounded-xl
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-gray-100
          shadow"
        >
          <img
            src={user.profileImage?.url || DEFAULT_AVATAR}
            alt="Profile"
            onClick={() => setOpenImageModal(true)}
            className="w-24 h-24 rounded-full border object-cover cursor-pointer hover:opacity-80"
          />

          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
<p className="text-gray-600 dark:text-gray-400 break-all max-w-full text-sm">
  {user.email}
</p>

            <span
              className="inline-block mt-2 px-3 py-1 text-sm rounded-full
              bg-green-100 text-green-700
              dark:bg-green-900 dark:text-green-300"
            >
              Active
            </span>
          </div>
        </div>

        {/* ===== INFO CARDS ===== */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="flex items-center gap-2">
                <User size={18} /> Name: {user.name}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={18} /> Email: {user.email}
              </p>
              <p className="flex items-center gap-2">
                <Shield size={18} /> Role: {user.isAdmin ? "Admin" : "User"}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>

            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                Created:{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                Last Login:{" "}
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* ===== QUICK ACTIONS ===== */}
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* Home */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                 text-gray-700 dark:text-gray-300
                 hover:text-indigo-600 dark:hover:text-indigo-400
                 hover:bg-indigo-50 dark:hover:bg-indigo-950
                 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>

            {/* My Orders */}
            <Link
              to="/my-orders"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                 text-gray-700 dark:text-gray-300
                 hover:text-emerald-600 dark:hover:text-emerald-400
                 hover:bg-emerald-50 dark:hover:bg-emerald-950
                 transition-all duration-200"
            >
              <Package className="w-5 h-5" />
              My Orders
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                 text-gray-700 dark:text-gray-300
                 hover:text-orange-600 dark:hover:text-orange-400
                 hover:bg-orange-50 dark:hover:bg-orange-950
                 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
            </Link>

            {/* Favorites */}
            <Link
              to="/wishlist"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                 text-gray-700 dark:text-gray-300
                 hover:text-pink-600 dark:hover:text-pink-400
                 hover:bg-pink-50 dark:hover:bg-pink-950
                 transition-all duration-200"
            >
              <Heart className="w-5 h-5" />
              Favorites
            </Link>

            {/* Help */}
            <Link
              to="/help"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                 text-gray-700 dark:text-gray-300
                 hover:text-sky-600 dark:hover:text-sky-400
                 hover:bg-sky-50 dark:hover:bg-sky-950
                 transition-all duration-200"
            >
              <HelpCircle className="w-5 h-5" />
              Help
            </Link>
          </div>
        </div>

        {/* ===== EDIT PROFILE ===== */}
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow">
          <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

          <div className="flex gap-3">
            <Link
              to="/profile/edit"
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
            >
              Edit Name / Picture
            </Link>
            <Link
              to="/profile/change-password"
              className="px-4 py-2 rounded bg-gray-700 text-white text-sm"
            >
              Change Password
            </Link>
          </div>
        </div>

        {/* ===== SECURITY ===== */}
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow">
          <h2 className="text-lg font-semibold mb-4">Security & Control</h2>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setOpenLogoutDialog(true)}
              className="px-4 py-2 text-sm rounded
                bg-yellow-500 text-white"
            >
              Logout
            </button>

            <button
              onClick={() => setOpenDeleteDialog(true)}
              className="px-4 py-2 text-sm rounded
                bg-red-600 text-white"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* ===== DIALOGS ===== */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>
          <Button color="warning" variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>This action is permanent.</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteAccount}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ProfileImageModal
        isOpen={openImageModal}
        onClose={() => setOpenImageModal(false)}
        imageUrl={user.profileImage?.url}
        onChangeProfile={() => navigate("/profile/edit")}
      />
    </>
  );
};

export default Profile;
