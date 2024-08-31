import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faWarehouse,
  faFileAlt,
  faCog,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@tanstack/react-router";

interface DashboardCard {
  title: string;
  icon: IconDefinition;
  count: number;
  link: string;
}

const dashboardCards: DashboardCard[] = [
  { title: "Users", icon: faUsers, count: 150, link: "/admin/users" },
  {
    title: "Inventory",
    icon: faWarehouse,
    count: 500,
    link: "/admin/inventory",
  },
  { title: "Reports", icon: faFileAlt, count: 30, link: "/admin/reports" },
  { title: "Settings", icon: faCog, count: 10, link: "/admin/settings" },
];

const DashboardContent: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardCards.map((card, index) => (
        <Link
          key={index}
          to={card.link}
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="card-body">
            <h2 className="card-title">
              <FontAwesomeIcon icon={card.icon} className="mr-2" />
              {card.title}
            </h2>
            <p className="text-3xl font-bold">{card.count}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DashboardContent;
