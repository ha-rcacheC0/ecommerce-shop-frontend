import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faCog,
  faChevronLeft,
  faChevronRight,
  faFile,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet } from "@tanstack/react-router";

const Sidebar = ({
  expanded,
  toggleSidebar,
}: {
  expanded: boolean;
  toggleSidebar: () => void;
}) => {
  const menuItems = [
    { icon: faHome, label: "Home", toDest: "/admin" },
    { icon: faUsers, label: "Users", toDest: "/admin/users" },
    { icon: faFile, label: "Reports", toDest: "/admin/reports" },
    { icon: faWarehouse, label: "Inventory", toDest: "/admin/inventory" },
    { icon: faCog, label: "Settings", toDest: "/admin/settings" },
  ];

  return (
    <div
      className={`bg-primary text-white h-screen ${expanded ? "w-64" : "w-16"} transition-all duration-300 ease-in-out`}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white"
        >
          <FontAwesomeIcon
            icon={expanded ? faChevronLeft : faChevronRight}
            size="lg"
          />
        </button>
      </div>
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2  ">
              <Link
                to={item.toDest}
                className="flex items-center gap-2 text-right p-4 hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={item.icon} className="w-10" size="lg" />
                {expanded && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const AdminDashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="flex">
      <Sidebar expanded={sidebarExpanded} toggleSidebar={toggleSidebar} />
      <Outlet />
    </div>
  );
};

export { AdminDashboard };
