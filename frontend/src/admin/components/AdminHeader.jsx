import { Link } from "react-router-dom";
import { Menu, ArrowLeft } from "lucide-react";

const AdminHeader = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b
  bg-white dark:bg-gray-900
  border-gray-200 dark:border-gray-800
  sticky top-0 z-30"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-semibold">
          Admin Dashboard
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <Link
        to="/"
        className="flex items-center gap-2 text-sm text-gray-600
        dark:text-gray-300 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back to Store
      </Link>
    </header>
  );
};

export default AdminHeader;
