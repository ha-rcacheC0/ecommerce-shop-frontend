import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faWarehouse,
  faFileAlt,
  faCog,
  IconDefinition,
  faBoxesStacked,
  faBoxesPacking,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllUsersQueryOptions } from "../api/users/userQueryOptions.api";
import { useAuth } from "../providers/auth.provider";
import { getAllItemsInInventoryQueryOptions } from "../api/admin/inventoryQueries";
import { getAllProductsQueryOptions } from "../api/products/productsQueries";
import { getAllShowsQueryOptions } from "../api/shows/showsQueries";

interface DashboardCard {
  title: string;
  icon: IconDefinition;
  count: number;
  link: string;
}

const DashboardContent: React.FC = () => {
  const auth = useAuth();
  const {
    data: users,
    isLoading: usersIsLoading,
    isError: usersIsError,
  } = useQuery(getAllUsersQueryOptions(auth.user!.token!));
  const {
    data: inventory,
    isLoading: inventoryIsLoading,
    isError: inventoryIsError,
  } = useQuery(getAllItemsInInventoryQueryOptions());
  const {
    data: productsData,
    isLoading: productsIsLoading,
    isError: productsIsError,
  } = useQuery(
    getAllProductsQueryOptions({
      page: 1,
      pageSize: 100,
      searchTitle: "",
      isShow: false, // Only regular products, not shows
      selectedBrands: [],
      selectedCategories: [],
    })
  );
  const {
    data: shows,
    isLoading: showsIsLoading,
    isError: showsIsError,
  } = useQuery(getAllShowsQueryOptions());

  const inventoryCount =
    inventory?.reduce((acc, elm) => (acc += elm.availableStock), 0) || 0;
  const dashboardCards: DashboardCard[] = [
    {
      title: "Users",
      icon: faUsers,
      count: users?.length || 0,
      link: "/admin/users",
    },
    {
      title: "Inventory",
      icon: faWarehouse,
      count: inventoryCount,
      link: "/admin/inventory",
    },
    {
      title: "Products",
      icon: faBoxesStacked,
      count: productsData?.totalItems || 0,
      link: "/admin/products",
    },
    {
      title: "Shows",
      icon: faBoxesPacking,
      count: shows?.length || 0,
      link: "/admin/shows",
    },
  ];
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
