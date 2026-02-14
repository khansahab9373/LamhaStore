import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import { User, Camera } from "lucide-react";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(
    user?.profileImage?.url || DEFAULT_AVATAR
  );

  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const { data } = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(data);
      showAlert("Profile updated successfully", "success");
      navigate("/profile");
    } catch (err) {
      showAlert(
        err.response?.data?.message ||
          "Failed to update profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User />
        Edit Profile
      </h1>

      <form
        onSubmit={submitHandler}
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border
          dark:border-gray-800 space-y-6"
      >
        {/* PROFILE IMAGE */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={preview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border
                dark:border-gray-700"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white
              p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition">
              <Camera size={14} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload profile picture
          </p>
        </div>

        {/* NAME */}
        <div>
          <label className="block font-medium mb-1">
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border dark:border-gray-700 rounded px-3 py-2
              bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SAVE BUTTON */}
        <button
          disabled={loading}
          className={`w-full py-2 rounded font-medium text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
