import React, { ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface SidebarItem {
  icon: IconDefinition;
  label: string;
  id: string;
}

interface AdminPageLayoutProps {
  title: string;
  sidebarItems: SidebarItem[];
  children: (selectedItem: string | null) => ReactNode;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  title,
  sidebarItems,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

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
        <div className="flex-1 px-2 mx-2 text-xl font-bold">{title}</div>
        <div className="flex-none hidden lg:block">
          <ul className="menu menu-horizontal">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`tooltip ${selectedItem === item.id ? "bg-primary-focus" : ""}`}
                  data-tip={item.label}
                  onClick={() => setSelectedItem(item.id)}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span className="hidden xl:inline ml-2">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-1 bg-slate-100">
        {/* Sidebar for mobile */}
        <aside
          className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-primary text-base-content transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-200 ease-in-out`}
        >
          <div className="flex justify-between items-center p-4 bg-primary">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={toggleSidebar} className="btn btn-ghost btn-sm">
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
          </div>
          <ul className="menu p-4 bg-primary">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setSelectedItem(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-4 ${selectedItem === item.id ? "bg-base-200" : ""}`}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-2 overflow-y-auto">
          {children(selectedItem)}
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

export default AdminPageLayout;
