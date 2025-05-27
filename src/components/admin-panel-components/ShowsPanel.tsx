import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminPageLayout from "./AdminPageLayout";
import {
  faTheaterMasks,
  faBoxes,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import {
  getAllShowsQueryOptions,
  useDeleteShowMutation,
} from "@api/shows/showsQueries";

import { ShowWithProducts } from "@/types";
import { toast } from "react-toastify";
import ShowTypesManager from "./ShowTypesManager";
import { useAuth } from "@providers/auth.provider";
import {
  ActionButton,
  DataTable,
} from "@components/component-parts/data-table";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
interface ShowTableItem extends ShowWithProducts, Record<string, unknown> {}

const ShowsPanel = () => {
  const auth = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState<string | null>("all-shows");

  const {
    data: shows,
    isLoading,
    isError,
    isFetching,
    isPlaceholderData,
  } = useQuery(getAllShowsQueryOptions());

  const deleteShowMutation = useDeleteShowMutation(
    auth.user!.token!,
    () => toast.success("Show deleted successfully"),
    (error) => toast.error(`Error deleting show: ${error.message}`)
  );

  const filteredShows = shows?.filter((show: ShowWithProducts) => {
    const matchesSearch =
      show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const columnHelper = createColumnHelper<ShowTableItem>();

  const columns = [
    columnHelper.accessor((show) => show, {
      id: "image",
      header: "Image",
      cell: (info) => {
        const show = info.getValue();
        return (
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img
                src={show.image}
                alt={show.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/vite.svg";
                }}
              />
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("sku", {
      header: "SKU",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("title", {
      header: "Show Title",
      cell: (info) => info.getValue(),
      meta: { className: "font-bold " },
    }),
    columnHelper.accessor((row) => row.showType.name, {
      header: "Show Type",
      cell: (info) => info.getValue(),
      meta: { className: "font-bold" },
    }),
    columnHelper.accessor("casePrice", {
      header: "Price",
      cell: (info) => `$${parseFloat(info.getValue().toString()).toFixed(2)}`,
    }),
    columnHelper.accessor((row) => row.showProducts.length, {
      header: "Show Products",
      cell: (info) => info.getValue(),
      meta: { className: "text-center" },
    }),
    columnHelper.accessor((row) => row.inStock, {
      header: "Stock Status",
      cell: (info) => (
        <span
          className={`badge ${
            info.getValue()
              ? "badge-success group-hover:ring-2 group-hover:ring-white group-hover:ring-opacity-70"
              : "badge-error group-hover:ring-2 group-hover:ring-white group-hover:ring-opacity-70"
          }`}
        >
          {info.getValue() ? "In Stock" : "Out of Stock"}
        </span>
      ),
      meta: { className: "text-center" },
    }),
  ] as ColumnDef<ShowTableItem>[];

  const actions: ActionButton<ShowWithProducts>[] = [
    {
      icon: faEdit,
      color: "warning",
      to: "/admin/shows/$showId/edit",
      getParams: (show) => ({ showId: show.id }),
    },
    {
      icon: faTrash,
      color: "error",
      onClick: (show) => {
        if (window.confirm("Are you sure you want to delete this show?")) {
          deleteShowMutation.mutate(show.id);
        }
      },
    },
  ];
  const showsSidebarItems = [
    { icon: faTheaterMasks, label: "All Shows", id: "all-shows" },
    { icon: faBoxes, label: "Manage Types", id: "manage-types" },
  ];
  const handleSidebarItemSelect = (itemId: string | null) => {
    setSelectedView(itemId);
  };

  return (
    <AdminPageLayout
      title="Shows Management"
      sidebarItems={showsSidebarItems}
      onSidebarItemSelect={handleSidebarItemSelect}
    >
      {(selectedItem) => {
        const viewTitle = selectedItem
          ? selectedItem
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())
          : "All Shows";
        if (selectedView === "manage-types") {
          return <ShowTypesManager />;
        }
        return (
          <div className="p-6">
            <DataTable
              title={viewTitle}
              data={filteredShows as ShowTableItem[]}
              columns={columns}
              actions={actions}
              isLoading={isLoading}
              isError={isError}
              errorMessage="Error fetching shows"
              createButton={{
                label: "Create New Show",
                to: "/admin/shows/create",
              }}
              searchConfig={{
                placeholder: "Search shows...",
                searchTerm: searchTerm,
                onSearch: setSearchTerm,
              }}
              pagination={{
                currentPage: page,
                pageSize: pageSize,
                setPage: setPage,
                setPageSize: setPageSize,
                hasMore: false,
                isFetching,
                isPlaceholderData,
                totalRows: filteredShows?.length,
                manualPagination: true,
              }}
              manualSorting={true}
              initialSorting={[{ id: "title", desc: false }]}
            />
          </div>
        );
      }}
    </AdminPageLayout>
  );
};
export default ShowsPanel;
