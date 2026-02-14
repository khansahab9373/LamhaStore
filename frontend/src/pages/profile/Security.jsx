import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import { AlertTriangle, Trash2 } from "lucide-react";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const Security = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] =
    useState(false);

  // ❌ Delete account
  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      await api.delete("/users/delete-account");

      showAlert("Account deleted successfully", "success");

      logout();
      navigate("/login");
    } catch (err) {
      showAlert(
        err.response?.data?.message ||
          "Failed to delete account",
        "error"
      );
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          Security & Control
        </h1>

        {/* ===== DANGER ZONE ===== */}
        <div
          className="bg-red-50 dark:bg-red-950/30
            border border-red-300 dark:border-red-800
            rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-red-600" />
            <h2 className="text-xl font-semibold text-red-600">
              Danger Zone
            </h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Deleting your account will permanently remove your
            profile, profile image and all associated data.
            <span className="font-semibold text-red-600">
              {" "}
              This action cannot be undone.
            </span>
          </p>

          <button
            onClick={() => setOpenDeleteDialog(true)}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2
              text-white rounded-lg transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
          >
            <Trash2 size={18} />
            Delete Account
          </button>
        </div>
      </div>

      {/* ===== DELETE ACCOUNT CONFIRM DIALOG ===== */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle />
          Delete Account
        </DialogTitle>

        <DialogContent>
          This action is permanent. All your data will be lost
          forever. Are you absolutely sure?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Security;
