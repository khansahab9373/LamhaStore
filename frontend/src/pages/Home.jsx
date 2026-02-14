import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAlert } from "../context/AlertContext";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showAlert } = useAlert();

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        showAlert("Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, showAlert]);

  const filteredProducts = products.filter(
    (product) =>
      product.productName
        ?.toLowerCase()
        .includes(keyword.toLowerCase()) ||
      product.brandName
        ?.toLowerCase()
        .includes(keyword.toLowerCase())
  );

  return (
    <div className="space-y-14">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden rounded-2xl bg-black text-white">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 py-20">
          {/* LEFT */}
          <div>
            <span className="inline-block mb-5 px-4 py-1 text-xs font-semibold rounded-full border border-white/20">
              ⌚ Premium Collection 2026
            </span>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
              Elevate Your Time <br />
              <span className="text-slate-300">
                With Luxury Watches
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-slate-300 text-lg">
              Discover hand-picked premium watches crafted for
              elegance, performance, and timeless style.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/"
                className="px-7 py-3 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition"
              >
                Shop Now
              </Link>

              <Link
                to="/products"
                className="px-7 py-3 border border-white/30 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl hover:scale-105 transition duration-500">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                alt="Luxury Watch"
                className="w-[260px] md:w-[300px] rounded-xl"
              />
              <div className="mt-4 text-center">
                <p className="font-semibold">
                  Luxury Watch Series
                </p>
                <p className="text-sm text-slate-300">
                  Starting from ₹4,999
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {keyword
            ? `Search results for "${keyword}"`
            : "Latest Products"}
        </h2>

        {loading && (
          <p className="mt-6 text-slate-500">
            Loading products...
          </p>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 mt-8">
          {!loading &&
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <p className="mt-6 text-slate-500">
            No products found.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
