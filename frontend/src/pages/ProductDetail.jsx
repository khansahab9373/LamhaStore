import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { ShoppingCart, Play, Heart } from "lucide-react";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {
  const { addToCart } = useContext(CartContext);
  const wishlistContext = useContext(WishlistContext);

const toggleWishlist = wishlistContext?.toggleWishlist;
const isInWishlist = wishlistContext?.isInWishlist;

  const { user } = useContext(AuthContext);
  const { showAlert } = useAlert();

  const [qty, setQty] = useState(1);
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);

        if (data.images?.length > 0) {
          setActiveMedia({
            type: "image",
            url: data.images[0].url,
          });
        } else if (data.productVideo?.url) {
          setActiveMedia({
            type: "video",
            url: data.productVideo.url,
          });
        }

        const relatedRes = await api.get(
          `/products?category=${data.category}`
        );

        const filtered = relatedRes.data
          .filter((p) => p._id !== data._id)
          .slice(0, 6);

        setRelatedProducts(filtered);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-slate-500">Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return null;

const inWishlist = isInWishlist
  ? isInWishlist(product._id)
  : false;

 const wishlistHandler = () => {
  if (!user) {
    showAlert("Please login to use wishlist", "warning");
    return;
  }

  if (!toggleWishlist) {
    showAlert("Wishlist not available", "error");
    return;
  }

  toggleWishlist(product._id);
};


  return (
    <div className="space-y-16">
      {/* ================= PRODUCT DETAIL ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT : MEDIA */}
        <div className="space-y-4">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center h-[420px] overflow-hidden border border-slate-200 dark:border-slate-800">
            {activeMedia?.type === "image" && (
              <img
                src={activeMedia.url}
                alt={product.productName}
                className="max-h-full max-w-full object-contain"
              />
            )}

            {activeMedia?.type === "video" && (
              <video
                src={activeMedia.url}
                controls
                muted
                autoPlay
                className="max-h-full"
              />
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.images?.map((img, index) => (
              <button
                key={`img-${index}`}
                onClick={() =>
                  setActiveMedia({ type: "image", url: img.url })
                }
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border transition
                  ${
                    activeMedia?.url === img.url
                      ? "border-black dark:border-white"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
              >
                <img
                  src={img.url}
                  alt="thumb"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}

            {product.productVideo?.url && (
              <button
                onClick={() =>
                  setActiveMedia({
                    type: "video",
                    url: product.productVideo.url,
                  })
                }
                className={`flex-shrink-0 w-16 h-16 rounded-lg border flex items-center justify-center
                  ${
                    activeMedia?.type === "video"
                      ? "border-black dark:border-white"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
              >
                <Play size={18} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT : DETAILS */}
        <div className="space-y-5">
          {/* TITLE + WISHLIST */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              {product.productName}
            </h1>

            <button
              onClick={wishlistHandler}
              title={
                inWishlist
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className="p-2 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Heart
                size={22}
                className={
                  inWishlist
                    ? "fill-red-500 text-red-500"
                    : "text-slate-600 dark:text-slate-300"
                }
              />
            </button>
          </div>

          {/* ==== REST IS 100% UNCHANGED ==== */}
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>Brand:</strong> {product.brandName} ·{" "}
            <strong>Category:</strong> {product.category}
          </p>

          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
            {product.discountPrice > 0 ? (
              <>
                <span className="line-through text-slate-400 mr-2 text-base">
                  ₹{product.price}
                </span>
                ₹{product.discountPrice}
              </>
            ) : (
              <>₹{product.price}</>
            )}
          </p>

          <p className="text-slate-700 dark:text-slate-300">
            {product.shortDescription}
          </p>

          <p className="text-sm">
            <strong>Status:</strong>{" "}
            <span
              className={
                product.stockStatus === "in_stock"
                  ? "text-green-600"
                  : "text-red-500"
              }
            >
              {product.stockStatus === "in_stock"
                ? "In Stock"
                : "Out of Stock"}
            </span>
          </p>

          {product.stockStatus === "in_stock" && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Qty</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-1.5 rounded-md"
              >
                {[...Array(Math.min(product.stockQuantity, 10)).keys()].map(
                  (x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          <button
            disabled={product.stockStatus !== "in_stock"}
            onClick={() => addToCart(product, qty)}
            className={`mt-3 flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition
              ${
                product.stockStatus === "in_stock"
                  ? "bg-black text-white hover:opacity-80 dark:bg-white dark:text-black"
                  : "bg-slate-300 text-slate-600 cursor-not-allowed"
              }`}
          >
            <ShoppingCart size={18} />
            Add To Cart
          </button>
        </div>
      </div>

      {/* ================= RELATED PRODUCTS (UNCHANGED) ================= */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              You may also like
            </h2>

            <Link
              to="/products"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
