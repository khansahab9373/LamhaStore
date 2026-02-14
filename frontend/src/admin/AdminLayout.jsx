


import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
     className="h-screen flex overflow-hidden
    bg-gray-100 dark:bg-gray-900
    text-gray-900 dark:text-gray-100
    transition-colors duration-300"
    >
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        
        {/* ADMIN HEADER (DESKTOP + MOBILE) */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* PAGE CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;


