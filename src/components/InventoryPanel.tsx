import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getInventoryQueryOptions } from "../api/admin/inventoryQueries";
import AdminPageLayout from "./AdminPageLayout";
import {
  faBox,
  faBoxOpen,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { TInventoryUnitProduct } from "../types";
import { DataTable } from "./component-parts/data-table";

// Define the table item type
interface InventoryTableItem
  extends TInventoryUnitProduct,
    Record<string, unknown> {}

const InventoryPanel = () => {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Query inventory data with pagination
  const {
    data: inventoryData,
    isLoading,
    isError,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    ...getInventoryQueryOptions({
      page: currentPage,
      pageSize: pageSize,
      search: searchTerm,
      view: selectedView,
    }),
    placeholderData: keepPreviousData,
  });

  // Create column helper
  const columnHelper = createColumnHelper<InventoryTableItem>();

  // Define columns - use type assertion to fix TypeScript error
  const columns = [
    columnHelper.accessor("sku", {
      header: "SKU",
      cell: (info) => info.getValue(),
      meta: { className: "text-center" },
    }),
    columnHelper.accessor((row) => row.product.title, {
      id: "productTitle",
      header: "Product Name",
      cell: (info) => info.getValue(),
      meta: { className: "text-center" },
    }),
    columnHelper.accessor("unitPrice", {
      header: "Unit Price",
      cell: (info) => `$${info.getValue()}`,
      meta: { className: "text-center" },
    }),
    columnHelper.accessor("package", {
      header: "Package",
      cell: (info) => info.getValue().join(", "),
      meta: { className: "text-center" },
    }),
    columnHelper.accessor("availableStock", {
      header: "Available Stock",
      cell: (info) => info.getValue(),
      meta: { className: "text-center" },
      sortingFn: "basic",
    }),
  ] as ColumnDef<InventoryTableItem>[]; // Type assertion here

  // Define sidebar items
  const inventorySidebarItems = [
    { icon: faWarehouse, label: "All Inventory", id: "all-inventory" },
    { icon: faBox, label: "Low Stock", id: "low-stock" },
    { icon: faBoxOpen, label: "Out of Stock", id: "out-of-stock" },
  ];

  // Handle sidebar item selection
  const handleSidebarItemSelect = (itemId: string | null) => {
    setSelectedView(itemId === "all-inventory" ? null : itemId);
    setCurrentPage(1); // Reset to first page when changing view
  };

  // Handle search input changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <AdminPageLayout
      title="Inventory Management"
      sidebarItems={inventorySidebarItems}
      onSidebarItemSelect={handleSidebarItemSelect}
    >
      {(selectedItem) => (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-base-content">
            {selectedItem
              ? selectedItem
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              : "All Inventory"}
          </h2>

          <DataTable<InventoryTableItem>
            data={inventoryData?.items as InventoryTableItem[]}
            columns={columns}
            isLoading={isLoading}
            isError={isError}
            errorMessage="Error fetching inventory data"
            searchConfig={{
              placeholder: "Search inventory...",
              searchTerm: searchTerm,
              onSearch: handleSearch,
            }}
            emptyMessage="No inventory items found."
            initialSorting={[{ id: "sku", desc: false }]}
            pagination={{
              currentPage,
              pageSize,
              setPage: setCurrentPage,
              setPageSize,
              hasMore: inventoryData?.pagination.hasMore || false,
              isFetching,
              isPlaceholderData,
              totalRows: inventoryData?.pagination.totalItems,
              manualPagination: true, // Tell the table pagination is handled server-side
            }}
            manualSorting={true} // Sorting is also handled server-side
          />
        </div>
      )}
    </AdminPageLayout>
  );
};

export default InventoryPanel;
