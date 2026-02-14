import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";

const AdminDashboard = () => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    paidOrders: 0,
    unpaidOrders: 0,
    deliveredOrders: 0,
    pendingDelivery: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [productsRes, ordersRes, usersRes] =
          await Promise.all([
            api.get("/products"),
            api.get("/orders"),
            api.get("/users"),
          ]);

        const products = productsRes.data.length;
        const orders = ordersRes.data;

        const normalUsers = usersRes.data.filter(
          (user) => !user.isAdmin
        );

        const paidOrders = orders.filter((o) => o.isPaid);
        const deliveredOrders = orders.filter((o) => o.isDelivered);

        const revenue = paidOrders.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );

        setStats({
          products,
          orders: orders.length,
          users: normalUsers.length,
          revenue,
          paidOrders: paidOrders.length,
          unpaidOrders: orders.length - paidOrders.length,
          deliveredOrders: deliveredOrders.length,
          pendingDelivery:
            orders.length - deliveredOrders.length,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        showAlert(
          err.response?.data?.message ||
            "Failed to load dashboard data",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showAlert]);

  if (loading)
    return (
      <p className="text-center mt-10">
        Loading dashboard...
      </p>
    );

  return (
    <div className="space-y-8 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold">
        Admin Dashboard
      </h1>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: stats.products },
          { label: "Total Orders", value: stats.orders },
          { label: "Total Users", value: stats.users },
          {
            label: "Revenue",
            value: `₹${stats.revenue}`,
            highlight: true,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow text-center"
          >
            <p className="text-sm text-gray-500">
              {item.label}
            </p>
            <p
              className={`text-2xl font-bold ${
                item.highlight
                  ? "text-green-600"
                  : ""
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ORDER STATUS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Paid Orders", value: stats.paidOrders },
          { label: "Unpaid Orders", value: stats.unpaidOrders },
          { label: "Delivered", value: stats.deliveredOrders },
          { label: "Pending", value: stats.pendingDelivery },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center"
          >
            <p className="text-xs sm:text-sm">
              {item.label}
            </p>
            <p className="text-lg font-semibold">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold p-5">
          Recent Orders
        </h2>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-center">Paid</th>
                <th className="p-3 text-center">Delivered</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t dark:border-gray-700"
                >
                  <td className="p-3">{order._id}</td>
                  <td className="p-3">
                    {order.user?.email || "N/A"}
                  </td>
                  <td className="p-3">
                    ₹{order.totalPrice}
                  </td>
                  <td className="p-3 text-center">
                    {order.isPaid ? "Yes" : "No"}
                  </td>
                  <td className="p-3 text-center">
                    {order.isDelivered
                      ? "Yes"
                      : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4 p-4">
          {recentOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 dark:border-gray-700"
            >
              <p className="text-xs text-gray-500">
                Order ID
              </p>
              <p className="font-mono text-sm break-all">
                {order._id}
              </p>

              <p className="mt-2 text-sm">
                <span className="font-semibold">
                  User:
                </span>{" "}
                {order.user?.email || "N/A"}
              </p>

              <p className="text-sm">
                <span className="font-semibold">
                  Amount:
                </span>{" "}
                ₹{order.totalPrice}
              </p>

              <div className="flex gap-4 mt-2 text-sm">
                <span>
                  <strong>Paid:</strong>{" "}
                  {order.isPaid ? "Yes" : "No"}
                </span>
                <span>
                  <strong>Delivered:</strong>{" "}
                  {order.isDelivered ? "Yes" : "No"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
