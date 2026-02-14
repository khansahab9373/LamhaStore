import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { useAlert } from "../context/AlertContext";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react";

const Order = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        showAlert(
          error.response?.data?.message || "Failed to fetch order",
          "error"
        );
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate, showAlert]);

  // ✅ SAME LOGIC AS MyOrders
  const getPaidLabel = () => {
    if (order.isPaid) return "Paid";
    if (order.paymentMethod === "COD" && order.isDelivered)
      return "Paid (COD)";
    return "Not Paid";
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-800 dark:text-gray-200">
        <h2 className="text-xl font-semibold">
          Loading order details...
        </h2>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 🔙 BACK */}
        <Link
          to={user?.isAdmin ? "/admin/orders" : "/my-orders"}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 
                     bg-white dark:bg-gray-800 
                     text-gray-800 dark:text-gray-200
                     rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <ArrowLeft size={16} />
          {user?.isAdmin ? "Back to Admin Orders" : "Back to My Orders"}
        </Link>

        {/* ===== ORDER HEADER ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Order{" "}
            <span className="text-blue-600">
              #{order._id.slice(-8)}
            </span>
          </h1>

          <div className="mt-4 flex flex-wrap gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                getPaidLabel().startsWith("Paid")
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {getPaidLabel()}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                order.isCancelled
                  ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                  : order.isDelivered
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              }`}
            >
              {order.isCancelled
                ? "Cancelled"
                : order.isDelivered
                ? "Delivered"
                : "Pending Delivery"}
            </span>
          </div>

          {order.isDelivered && order.deliveredAt && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Delivered on{" "}
              <span className="font-medium">
                {new Date(order.deliveredAt).toLocaleDateString()}
              </span>
            </p>
          )}
        </div>

        {/* ===== SHIPPING ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            🚚 Shipping Address
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {order.shippingAddress.address},{" "}
            {order.shippingAddress.city},{" "}
            {order.shippingAddress.country}
          </p>
        </div>

        {/* ===== ORDER ITEMS ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            🛒 Order Items
          </h2>

          <div className="divide-y dark:divide-gray-700">
            {order.orderItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 py-4"
              >
           <Link to={`/product/${item._id}`} >
           
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded-xl border dark:border-gray-700"
                />
           
           </Link>

                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Qty: {item.qty}
                  </p>
                </div>

                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  ₹{item.price * item.qty}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SUMMARY ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            💰 Order Summary
          </h2>

          <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-gray-100">
            <span>Total Amount</span>
            <span className="text-green-600 dark:text-green-400">
              ₹{order.totalPrice}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Order;
