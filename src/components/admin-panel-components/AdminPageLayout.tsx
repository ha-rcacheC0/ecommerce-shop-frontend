import React, { ReactNode, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface SidebarItem {
  icon: IconDefinition;
  label: string;
  id: string;
}

interface AdminPageLayoutProps {
  title: string;
  sidebarItems: SidebarItem[];
  children: (selectedItem: string | null) => ReactNode;
  onSidebarItemSelect?: (itemId: string | null) => void;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  title,
  sidebarItems,
  children,
  onSidebarItemSelect,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(
    sidebarItems.length > 0 ? sidebarItems[0].id : null
  );

  useEffect(() => {
    if (onSidebarItemSelect && selectedItem) {
      onSidebarItemSelect(selectedItem);
    }
  }, [selectedItem, onSidebarItemSelect]);

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
  };

  return (
    <div className="bg-base-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="w-full navbar bg-primary text-primary-content">
        <div className="flex-1 px-2 mx-2 text-xl font-bold">{title}</div>
        <div className="flex-none block">
          <ul className="menu menu-horizontal">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`tooltip ${selectedItem === item.id ? "bg-primary-focus" : ""}`}
                  data-tip={item.label}
                  onClick={() => handleItemSelect(item.id)}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span className="hidden xl:inline ml-2">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-2 overflow-y-auto">
        {children(selectedItem)}
      </main>
    </div>
  );
};

export default AdminPageLayout;
