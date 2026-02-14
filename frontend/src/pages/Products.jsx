import { useEffect, useState } from "react";
import api from "../services/api";
import { useAlert } from "../context/AlertContext";
import ProductCard from "../components/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const { showAlert } = useAlert();

  const [filters, setFilters] = useState({
    category: "all",
    gender: "all",
    brand: "all",
    price: "all",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch {
        showAlert("Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showAlert]);

  const filteredProducts = products.filter((product) => {
    if (filters.category !== "all" && product.category !== filters.category)
      return false;
    if (filters.gender !== "all" && product.gender !== filters.gender)
      return false;
    if (filters.brand !== "all" && product.brandName !== filters.brand)
      return false;

    const price =
      product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    if (filters.price === "0-2000" && price > 2000) return false;
    if (filters.price === "2000-5000" && (price < 2000 || price > 5000))
      return false;
    if (filters.price === "5000+" && price < 5000) return false;

    return true;
  });

  const brands = [...new Set(products.map((p) => p.brandName))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 overflow-x-hidden">
      {/* ===== MOBILE HEADER ===== */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <button
          onClick={() => setShowFilters(true)}
          className="p-2 rounded-full border"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* ===== MOBILE FILTER CHIPS ===== */}
      <div className="md:hidden flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {["all", "Smartwatch", "analog"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilters({ ...filters, category: cat })}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border
              ${
                filters.category === cat
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ===== DESKTOP SIDEBAR ===== */}
        <aside className="hidden md:block md:col-span-3 bg-white dark:bg-gray-900 border rounded-2xl p-6 space-y-6 sticky top-6 h-fit">
          <h2 className="text-lg font-bold">Filters</h2>

          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            {["all", "Smartwatch", "analog"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilters({ ...filters, category: cat })}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm
                  ${
                    filters.category === cat
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* ===== PRODUCTS ===== */}
        <section className="col-span-12 md:col-span-9">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      </div>

      {/* ===== MOBILE FILTER BOTTOM SHEET ===== */}
      {showFilters && (
        <>
          <div
            onClick={() => setShowFilters(false)}
            className="fixed inset-0 bg-black/40 z-40"
          />

          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Price</h3>
                {[
                  { label: "All", value: "all" },
                  { label: "Below ₹2000", value: "0-2000" },
                  { label: "₹2000 - ₹5000", value: "2000-5000" },
                  { label: "Above ₹5000", value: "5000+" },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() =>
                      setFilters({ ...filters, price: p.value })
                    }
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm
                      ${
                        filters.price === p.value
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
