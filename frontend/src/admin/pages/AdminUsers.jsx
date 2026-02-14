import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";
import { Users } from "lucide-react";

const AdminUsers = () => {
  const { showAlert } = useAlert();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/users");

        // exclude admin users
        const normalUsers = data.filter(
          (user) => !user.isAdmin
        );

        setUsers(normalUsers);
      } catch (err) {
        showAlert(
          err.response?.data?.message || "Failed to load users",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [showAlert]);

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading users...
      </p>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-x-hidden">
      {/* HEADER */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Users />
        Users
      </h1>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow border dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Admin</th>
              <th className="px-4 py-3 text-left">Joined</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3 font-medium">
                  {user.name}
                </td>

                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {user.email}
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                    No
                  </span>
                </td>

                <td className="px-4 py-3">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No users found
          </p>
        )}
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white dark:bg-gray-900 rounded-xl shadow border dark:border-gray-800 p-4"
          >
            <p className="font-semibold text-lg">
              {user.name}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
              {user.email}
            </p>

            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
                Admin: No
              </span>

              <span className="text-gray-500">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <p className="text-center text-gray-500">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
