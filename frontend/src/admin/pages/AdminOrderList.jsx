import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";

const inputClass =
  "px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

const AdminOrderList = () => {
  const { showAlert } = useAlert();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        setOrders(data);
        setFilteredOrders(data);
      } catch {
        showAlert("Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [showAlert]);

  useEffect(() => {
    let result = [...orders];

    if (search) {
      const k = search.toLowerCase();
      result = result.filter(
        (o) =>
          o._id.toLowerCase().includes(k) ||
          o.user?.name?.toLowerCase().includes(k) ||
          o.user?.email?.toLowerCase().includes(k) ||
          o.createdAt?.substring(0, 10).includes(k)
      );
    }

    if (paymentFilter !== "all") {
      result = result.filter((o) =>
        paymentFilter === "paid" ? o.isPaid : !o.isPaid
      );
    }

    if (deliveryFilter !== "all") {
      result = result.filter((o) =>
        deliveryFilter === "delivered"
          ? o.isDelivered
          : !o.isDelivered
      );
    }

    setFilteredOrders(result);
  }, [search, paymentFilter, deliveryFilter, orders]);

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order permanently?")) return;

    try {
      await api.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      showAlert("Order deleted", "success");
    } catch {
      showAlert("Delete failed", "error");
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      const { data } = await api.put(`/orders/${id}/cancel/admin`);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? data : o))
      );
      showAlert("Order cancelled", "success");
    } catch {
      showAlert("Cancel failed", "error");
    }
  };




  // ✅ NEW: MARK AS DELIVERED
  const markAsDelivered = async (id) => {
    if (!window.confirm("Mark this order as delivered?")) return;

    try {
      const { data } = await api.put(`/orders/${id}/deliver`);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? data : o))
      );
      showAlert("Order marked as delivered", "success");
    } catch {
      showAlert("Failed to update delivery status", "error");
    }
  };

  if (loading)
    return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6 space-y-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold">
        Orders
      </h1>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          placeholder="Search order / user / email / date"
          className={`${inputClass} w-full sm:w-64`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className={inputClass}
        >
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        <select
          value={deliveryFilter}
          onChange={(e) => setDeliveryFilter(e.target.value)}
          className={inputClass}
        >
          <option value="all">All Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow border dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <tr
                key={o._id}
                className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3 font-mono text-xs">
                  {o._id}
                </td>

                <td className="px-4 py-3">
                  <div className="font-medium">
                    {o.user?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {o.user?.email}
                  </div>
                </td>

                <td className="px-4 py-3 text-center font-semibold">
                  ₹{o.totalPrice}
                </td>

                <td className="px-4 py-3 text-center">
                  {o.isCancelled ? (
                    <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-700">
                      Cancelled
                    </span>
                  ) : o.isDelivered ? (
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                      Delivered
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-center space-x-3">
                  <Link
                    to={`/order/${o._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>

                  {!o.isDelivered && !o.isCancelled && (
                    <>
                      <button
                        onClick={() => markAsDelivered(o._id)}
                        className="text-green-600 hover:underline"
                      >
                        Deliver
                      </button>

                      <button
                        onClick={() => cancelOrder(o._id)}
                        className="text-orange-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteOrder(o._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No orders found
          </p>
        )}
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((o) => (
          <div
            key={o._id}
            className="bg-white dark:bg-gray-900 rounded-xl shadow border dark:border-gray-800 p-4"
          >
            <p className="text-xs text-gray-500">
              Order ID
            </p>
            <p className="font-mono text-xs break-all">
              {o._id}
            </p>

            <p className="mt-2 text-sm">
              <strong>User:</strong>{" "}
              {o.user?.name} ({o.user?.email})
            </p>

            <p className="text-sm">
              <strong>Total:</strong> ₹{o.totalPrice}
            </p>

            <p className="text-sm mt-1">
              <strong>Status:</strong>{" "}
              {o.isCancelled
                ? "Cancelled"
                : o.isDelivered
                ? "Delivered"
                : "Pending"}
            </p>

            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <Link
                to={`/order/${o._id}`}
                className="text-blue-600 hover:underline"
              >
                View
              </Link>

              {!o.isDelivered && !o.isCancelled && (
                <>
                  <button
                    onClick={() => markAsDelivered(o._id)}
                    className="text-green-600 hover:underline"
                  >
                    Deliver
                  </button>

                  <button
                    onClick={() => cancelOrder(o._id)}
                    className="text-orange-600 hover:underline"
                  >
                    Cancel
                  </button>
                </>
              )}

              <button
                onClick={() => deleteOrder(o._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500">
            No orders found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminOrderList;
