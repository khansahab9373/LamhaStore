import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const ProductCard = ({ product, onAddToCart }) => {
  const { addToCart } = useContext(CartContext);

  const hasDiscount = product.discountPrice && product.discountPrice > 0;

  const priceToShow = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="
  group
  bg-white dark:bg-gray-900
  border border-gray-200 dark:border-gray-800
  rounded-2xl overflow-hidden
  shadow-sm
  transition-all duration-300
  hover:-translate-y-1 hover:shadow-xl
"
>
      {/* IMAGE */}
      <Link to={`/product/${product._id}`}>
        <div className="relative h-52 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
          <img
            src={product.images?.[0]?.url}
            alt={product.productName}
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* SALE BADGE – TOP RIGHT */}
          {hasDiscount && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
              SALE
            </span>
          )}
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:underline">
            {product.productName}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {product.brandName}
        </p>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            ₹{priceToShow}
          </span>

          {hasDiscount && (
            <span className="text-xs line-through text-gray-400">
              ₹{product.price}
            </span>
          )}
        </div>

        {/* STOCK */}
        <p
          className={`text-xs font-medium ${
            product.stockStatus === "in_stock"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {product.stockStatus === "in_stock" ? "In Stock" : "Out of Stock"}
        </p>

        {/* ADD TO CART – ALWAYS VISIBLE */}
        <button
          disabled={product.stockStatus !== "in_stock"}
          onClick={() => addToCart(product, 1)}
          className={`w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
    ${
      product.stockStatus === "in_stock"
        ? "bg-black text-white hover:opacity-80 dark:bg-white dark:text-black"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
