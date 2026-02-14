import { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ❤️ ADD
  const addToWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev
        : [...prev, productId]
    );
  };

  // ❌ REMOVE
  const removeFromWishlist = (productId) => {
    setWishlist((prev) =>
      prev.filter((id) => id !== productId)
    );
  };

  // 🔁 TOGGLE
  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // ✅ MISSING FUNCTION (THIS WAS THE BUG)
  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist, // ✅ NOW AVAILABLE
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
