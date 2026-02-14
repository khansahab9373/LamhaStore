import { useContext, useEffect, useState } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { Heart, X } from "lucide-react";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);

      try {
        // ✅ EMPTY WISHLIST CASE
        if (!wishlist || wishlist.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // ✅ FETCH PRODUCTS BY IDS
        const { data } = await api.post("/products/by-ids", {
          ids: wishlist,
        });

        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load wishlist", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  // 🔒 NOT LOGGED IN
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Heart size={40} className="text-gray-400 mb-4" />
        <p className="text-lg font-medium">
          Please login to view your wishlist
        </p>
        <Link
          to="/login"
          className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:opacity-80"
        >
          Login
        </Link>
      </div>
    );
  }

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        My Wishlist
      </h1>

      {/* ❤️ EMPTY */}
      {products.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 text-center">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Your wishlist is empty
          </p>

          <Link
            to="/products"
            className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-lg hover:opacity-80"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        /* 🧱 PRODUCTS */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="relative">
              {/* ❌ REMOVE BUTTON */}
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="
                  absolute top-3 right-3 z-10
                  bg-white dark:bg-gray-900
                  border border-gray-300 dark:border-gray-700
                  rounded-full p-1.5
                  text-gray-600 dark:text-gray-300
                  hover:bg-red-500 hover:text-white
                  transition
                "
                title="Remove from wishlist"
              >
                <X size={14} />
              </button>

              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
