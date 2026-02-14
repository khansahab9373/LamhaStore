import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import { MapPin, CreditCard, FileText } from "lucide-react";

const PlaceOrder = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const itemsPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.discountPrice > 0
        ? item.discountPrice
        : item.price) *
        item.qty,
    0
  );

  const shippingPrice = itemsPrice > 5000 ? 0 : 100;
  const taxPrice = Math.round(itemsPrice * 0.02);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    if (cartItems.length === 0) {
      showAlert("Your cart is empty", "warning");
      return;
    }

    if (!address || !city || !postalCode || !country) {
      showAlert("Please fill all shipping details", "warning");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          productName: item.productName,
          image: item.images?.[0]?.url,
          price:
            item.discountPrice > 0
              ? item.discountPrice
              : item.price,
          qty: item.qty,
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const createdOrder = await createOrder(orderData);

      clearCart();
      showAlert("Order placed successfully", "success");
      navigate(`/order/${createdOrder._id}`);
    } catch (error) {
      showAlert(
        error.response?.data?.message ||
          "Failed to place order",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* SHIPPING */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <MapPin size={20} /> Shipping Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: address, set: setAddress, placeholder: "Address" },
                { value: city, set: setCity, placeholder: "City" },
                { value: postalCode, set: setPostalCode, placeholder: "Postal Code" },
                { value: country, set: setCountry, placeholder: "Country" },
              ].map((field, i) => (
                <input
                  key={i}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  placeholder={field.placeholder}
                  className="
                    w-full px-4 py-2 rounded-lg border
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                    border-gray-300 dark:border-gray-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                />
              ))}
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <CreditCard size={20} /> Payment Method
            </h2>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="
                w-full px-4 py-2 rounded-lg border
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            >
              <option value="COD">Cash on Delivery</option>
              <option value="CARD">Card</option>
            </select>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <FileText size={20} /> Order Summary
          </h2>

          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Items</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? "Free" : `₹${shippingPrice}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{taxPrice}</span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-green-600">₹{totalPrice}</span>
            </div>
          </div>

          <button
            onClick={placeOrderHandler}
            disabled={loading || cartItems.length === 0}
            className="
              w-full mt-6 py-3 rounded-xl
              bg-blue-600 text-white
              hover:bg-blue-700 transition
              disabled:bg-gray-400
            "
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
