import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center px-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div className="text-center md:text-left">
          <h1 className="text-6xl md:text-7xl font-extrabold text-indigo-600 dark:text-indigo-400">
            404
          </h1>

          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h2>

          <p className="mt-4 text-gray-600 dark:text-zinc-400 max-w-md">
            Oops! The page you are looking for doesn’t exist or may have been
            moved. Don’t worry, you can always find your way back home.
          </p>

          <Link
            to="/"
            className="
              inline-block mt-6 px-6 py-3 rounded-lg
              bg-indigo-600 text-white font-semibold
              hover:bg-indigo-700
              transition-all duration-300
              shadow-md hover:shadow-lg
            "
          >
            ← Back to Home
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da"
            alt="Page not found illustration"
            className="rounded-xl shadow-lg max-h-[420px] object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default PageNotFound;
