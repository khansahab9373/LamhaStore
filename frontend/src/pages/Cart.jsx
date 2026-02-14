import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import {
  Trash2,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const Cart = () => {
  const {
    cartItems,
    updateQty,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [openClearDialog, setOpenClearDialog] =
    useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.discountPrice > 0
        ? item.discountPrice
        : item.price) *
        item.qty,
    0
  );

  // 🛒 EMPTY CART
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-16 h-16 mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Add some products to get started
        </p>

        <Link
          to="/"
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      showAlert("Your cart is empty", "warning");
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Shopping Cart
        </h1>

        {/* CART ITEMS */}
        <div className="space-y-5">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row gap-4
                p-4 rounded-xl border
                bg-white dark:bg-gray-800
                shadow-sm hover:shadow-md transition"
            >
              {/* IMAGE */}
              <img
                src={item.images?.[0]?.url}
                alt={item.productName}
                className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-lg"
              />

              {/* INFO */}
              <div className="flex-1">
                <Link
                  to={`/product/${item._id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {item.productName}
                </Link>

                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  ₹{" "}
                  {item.discountPrice > 0
                    ? item.discountPrice
                    : item.price}
                </p>

                {item.discountPrice > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    Discount applied
                  </p>
                )}
              </div>

              {/* QTY */}
              {item.stockStatus === "in_stock" && (
                <select
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(
                      item._id,
                      Number(e.target.value)
                    )
                  }
                  className="h-10 border rounded-lg px-3
                    bg-transparent focus:ring-2 focus:ring-black"
                >
                  {[
                    ...Array(
                      Math.min(item.stockQuantity, 10)
                    ).keys(),
                  ].map((x) => (
                    <option
                      key={x + 1}
                      value={x + 1}
                    >
                      {x + 1}
                    </option>
                  ))}
                </select>
              )}

              {/* REMOVE */}
              <button
                onClick={() =>
                  removeFromCart(item._id)
                }
                className="flex items-center gap-1
                  text-red-600 hover:text-red-700
                  font-medium self-start sm:self-center"
              >
                <Trash2 size={18} />
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div
          className="mt-10 flex flex-col sm:flex-row
            justify-between items-start sm:items-center
            gap-4 border-t pt-6"
        >
          <h2 className="text-xl font-bold">
            Total: ₹ {totalPrice}
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenClearDialog(true)}
              className="px-4 py-2 border border-red-500
                text-red-600 rounded-lg
                hover:bg-red-50 dark:hover:bg-gray-700 transition"
            >
              Clear Cart
            </button>

            <button
              onClick={proceedToCheckout}
              className="px-6 py-2 bg-black text-white
                rounded-lg hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* ===== CLEAR CART DIALOG ===== */}
      <Dialog
        open={openClearDialog}
        onClose={() => setOpenClearDialog(false)}
      >
        <DialogTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle />
          Clear Cart
        </DialogTitle>

        <DialogContent>
          Are you sure you want to remove all items
          from your cart?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenClearDialog(false)}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              clearCart();
              setOpenClearDialog(false);
            }}
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Cart;
