import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  X,
  ArrowLeft,
  LogOut,
  ShieldUser,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
 const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Package size={18} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingCart size={18} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={18} />,
    },
  ];

  return (
    <aside
className={`
  fixed md:static z-40
  top-0 left-0
  h-screen w-64
  bg-white dark:bg-gray-900
  text-gray-800 dark:text-gray-100
  border-r border-gray-200 dark:border-gray-800
  transform transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0
  flex flex-col
  overflow-hidden
`}

    >
      {/* MOBILE CLOSE */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={onClose}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <X size={20} />
        </button>
      </div>

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-10 text-center tracking-wide flex items-center justify-center gap-2">
        <ShieldUser /> Admin Panel
      </h2>

      {/* NAV LINKS */}
      <nav className="space-y-2 flex-1">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg
                transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM ACTIONS */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        {/* BACK TO STORE */}
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2 text-sm
          text-gray-600 dark:text-gray-300
          hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <ArrowLeft size={18} />
          Back to Store
        </Link>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm
          text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
