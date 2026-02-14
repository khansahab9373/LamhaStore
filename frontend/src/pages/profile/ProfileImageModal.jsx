import React, { useContext, useState } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { Camera, Trash2, X } from "lucide-react";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const ProfileImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  onChangeProfile,
}) => {
  const { setUser } = useContext(AuthContext);
  const { showAlert } = useAlert();

  const [openRemoveDialog, setOpenRemoveDialog] =
    useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // ❌ Remove profile image
  const handleRemoveProfile = async () => {
    setLoading(true);

    try {
      const { data } = await api.put("/users/profile", {
        removeImage: true,
      });

      setUser(data);
      showAlert("Profile image removed", "success");

      setOpenRemoveDialog(false);
      onClose();
    } catch (err) {
      showAlert(
        err.response?.data?.message ||
          "Failed to remove profile image",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== CUSTOM MODAL ===== */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm
          flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white dark:bg-gray-900
            rounded-2xl p-6 w-[22rem] text-center
            shadow-xl border dark:border-gray-800"
        >
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500
              hover:text-gray-800 dark:hover:text-white"
          >
            <X size={18} />
          </button>

          {/* IMAGE */}
          <img
            src={imageUrl || DEFAULT_AVATAR}
            alt="Profile"
            className="w-44 h-44 rounded-full mx-auto
              object-cover border-4 border-blue-500 mb-6"
          />

          {/* ACTIONS */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onChangeProfile}
              className="flex items-center gap-2 px-4 py-2
                bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 transition"
            >
              <Camera size={16} />
              Change
            </button>

            <button
              onClick={() => setOpenRemoveDialog(true)}
              className="flex items-center gap-2 px-4 py-2
                bg-red-600 text-white rounded-lg
                hover:bg-red-700 transition"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* ===== REMOVE CONFIRM DIALOG ===== */}
      <Dialog
        open={openRemoveDialog}
        onClose={() => setOpenRemoveDialog(false)}
      >
        <DialogTitle>Remove Profile Image</DialogTitle>

        <DialogContent>
          Are you sure you want to remove your profile
          image?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenRemoveDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleRemoveProfile}
            disabled={loading}
          >
            {loading ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileImageModal;
