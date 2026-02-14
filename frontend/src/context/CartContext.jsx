import { createContext, useEffect, useState } from "react";
import { useAlert } from "./AlertContext";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { showAlert } = useAlert();

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ➕ ADD TO CART
  const addToCart = (product, qty) => {
    const existItem = cartItems.find(
      (x) => x._id === product._id
    );

    // ❌ Out of stock
    if (product.countInStock <= 0) {
      showAlert("Product is out of stock", "error");
      return;
    }

    if (existItem) {
      // ❌ Quantity exceeds stock
      if (existItem.qty + qty > product.countInStock) {
        showAlert(
          "Maximum stock limit reached",
          "warning"
        );
        return;
      }

      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id
            ? { ...x, qty: x.qty + qty }
            : x
        )
      );

      showAlert("Cart updated", "success");
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
      showAlert("Added to cart", "success");
    }
  };

  // 🔄 UPDATE QTY
  const updateQty = (id, qty) => {
    const item = cartItems.find((x) => x._id === id);

    if (!item) return;

    if (qty > item.countInStock) {
      showAlert(
        "Quantity exceeds available stock",
        "warning"
      );
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, qty } : item
      )
    );

    showAlert("Quantity updated", "info");
  };

  // ❌ REMOVE ITEM
  const removeFromCart = (id) => {
    setCartItems(
      cartItems.filter((item) => item._id !== id)
    );

    showAlert("Item removed from cart", "info");
  };

  // 🧹 CLEAR CART (ORDER SUCCESS)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");

    showAlert("Cart cleared", "success");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
