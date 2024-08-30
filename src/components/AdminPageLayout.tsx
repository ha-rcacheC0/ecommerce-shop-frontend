import React, { ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

interface SidebarItem {
  icon: IconDefinition;
  label: string;
  id: string;
}

interface SidebarProps {
  expanded: boolean;
  toggleSidebar: () => void;
  items: SidebarItem[];
  onItemSelect: (id: string) => void;
  selectedItem: string | null;
}

const Sidebar = ({
  expanded,
  toggleSidebar,
  items,
  onItemSelect,
  selectedItem,
}: SidebarProps) => {
  return (
    <div
      className={`bg-gray-800 text-white h-screen ${
        expanded ? "w-64" : "w-16"
      } transition-all duration-300 ease-in-out`}
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
          {items.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                className={`flex items-center gap-2 text-left w-full p-4 hover:bg-gray-700 ${
                  selectedItem === item.id ? "bg-gray-700" : ""
                }`}
                onClick={() => onItemSelect(item.id)}
              >
                <FontAwesomeIcon icon={item.icon} className="w-6" />
                {expanded && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

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
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar
        expanded={sidebarExpanded}
        toggleSidebar={toggleSidebar}
        items={sidebarItems}
        onItemSelect={setSelectedItem}
        selectedItem={selectedItem}
      />
      <div className="flex-1 overflow-auto">
        <h1 className="text-2xl font-bold p-6 bg-white text-gray-800 shadow-sm">
          {title}
        </h1>
        {children(selectedItem)}
      </div>
    </div>
  );
};
export default AdminPageLayout;
