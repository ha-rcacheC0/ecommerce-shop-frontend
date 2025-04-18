import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faWarehouse,
  IconDefinition,
  faBoxesStacked,
  faBoxesPacking,
  faSpinner,
  faExclamationTriangle,
  faRefresh,
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
  isLoading: boolean;
  isError: boolean;
}

const DashboardContent: React.FC = () => {
  const auth = useAuth();
  const {
    data: users,
    isLoading: usersIsLoading,
    isError: usersIsError,
    refetch: refetchUsers,
  } = useQuery(getAllUsersQueryOptions(auth.user!.token!));

  const {
    data: inventory,
    isLoading: inventoryIsLoading,
    isError: inventoryIsError,
    refetch: refetchInventory,
  } = useQuery(getAllItemsInInventoryQueryOptions());

  const {
    data: productsData,
    isLoading: productsIsLoading,
    isError: productsIsError,
    refetch: refetchProducts,
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
    refetch: refetchShows,
  } = useQuery(getAllShowsQueryOptions());

  const inventoryCount =
    inventory?.reduce((acc, elm) => (acc += elm.availableStock), 0) || 0;

  const dashboardCards: DashboardCard[] = [
    {
      title: "Users",
      icon: faUsers,
      count: users?.length || 0,
      link: "/admin/users",
      isLoading: usersIsLoading,
      isError: usersIsError,
    },
    {
      title: "Inventory",
      icon: faWarehouse,
      count: inventoryCount,
      link: "/admin/inventory",
      isLoading: inventoryIsLoading,
      isError: inventoryIsError,
    },
    {
      title: "Products",
      icon: faBoxesStacked,
      count: productsData?.totalItems || 0,
      link: "/admin/products",
      isLoading: productsIsLoading,
      isError: productsIsError,
    },
    {
      title: "Shows",
      icon: faBoxesPacking,
      count: shows?.length || 0,
      link: "/admin/shows",
      isLoading: showsIsLoading,
      isError: showsIsError,
    },
  ];

  const allQueriesLoading =
    usersIsLoading && inventoryIsLoading && productsIsLoading && showsIsLoading;

  const anyQueryError =
    usersIsError || inventoryIsError || productsIsError || showsIsError;

  // Handle refreshing all data
  const handleRefreshAll = () => {
    refetchUsers();
    refetchInventory();
    refetchProducts();
    refetchShows();
  };

  // If all queries are loading, show a loading state for the entire dashboard
  if (allQueriesLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-base-200 rounded-lg shadow-lg">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="3x"
          className="text-primary mb-4"
        />
        <h2 className="text-xl font-semibold">Loading dashboard data...</h2>
        <p className="text-base-content/70 mt-2">
          Please wait while we fetch the latest information.
        </p>
      </div>
    );
  }

  // If all queries failed, show an error state for the entire dashboard
  if (anyQueryError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-base-200 rounded-lg shadow-lg">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          size="3x"
          className="text-error mb-4"
        />
        <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
        <p className="text-base-content/70 mt-2 mb-4">
          There was a problem fetching the dashboard data.
        </p>
        <button className="btn btn-primary" onClick={handleRefreshAll}>
          <FontAwesomeIcon icon={faRefresh} className="mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {card.isLoading ? (
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>Loading...</span>
              </div>
            ) : card.isError ? (
              <div className="text-error flex items-center space-x-2">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <span>Error</span>
              </div>
            ) : (
              <p className="text-3xl font-bold">{card.count}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DashboardContent;
