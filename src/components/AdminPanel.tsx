import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faCog,
  faFile,
  faWarehouse,
  faBars,
  IconDefinition,
  faBoxesPacking,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet } from "@tanstack/react-router";
import DashboardContent from "./DashboardContent";

interface MenuItem {
  icon: IconDefinition;
  label: string;
  toDest: string;
}

const menuItems: MenuItem[] = [
  { icon: faHome, label: "Home", toDest: "/admin" },
  { icon: faUsers, label: "Users", toDest: "/admin/users" },
  { icon: faBoxes, label: "Products", toDest: "/admin/products" },
  { icon: faBoxesPacking, label: "Shows", toDest: "/admin/shows" },
  { icon: faFile, label: "Reports", toDest: "/admin/reports" },
  { icon: faWarehouse, label: "Inventory", toDest: "/admin/inventory" },
  { icon: faCog, label: "Settings", toDest: "/admin/settings" },
];

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-base-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="w-full navbar bg-primary text-primary-content">
        <div className="flex-none lg:hidden">
          <button onClick={toggleSidebar} className="btn btn-square btn-ghost">
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>
        <div className="flex-1 px-2 mx-2">Admin Dashboard</div>
        <div className="flex-none hidden lg:block">
          <ul className="menu menu-horizontal">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.toDest}
                  className="tooltip"
                  data-tip={item.label}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span className="hidden xl:inline ml-2">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar for mobile */}
        <aside
          className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-primary text-primary-content transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-200 ease-in-out`}
        >
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
            <button onClick={toggleSidebar} className="btn btn-ghost btn-sm">
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
          </div>
          <ul className="menu p-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.toDest}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-4"
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-2 overflow-y-auto bg-base-200">
          <div className="container mx-auto">
            <DashboardContent />
            <div className="mt-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export { AdminDashboard };
