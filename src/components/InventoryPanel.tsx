import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllItemsInInventoryQueryOptions } from "../api/admin/inventoryQueries";
import AdminPageLayout from "./AdminPageLayout";
import {
  faBox,
  faBoxOpen,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";

interface InventoryItem {
  id: string;
  sku: string;
  Product: { title: string };
  unitPrice: number;
  package: string[];
  availableStock: number;
}

const InventoryTable: React.FC<{ selectedView: string | null }> = ({
  selectedView,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: inventory,
    isLoading,
    isError,
  } = useQuery(getAllItemsInInventoryQueryOptions());
  const filteredInventory = useMemo(() => {
    return inventory.filter((item: InventoryItem) => {
      const matchesSearch =
        searchTerm === "" ||
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        item.Product.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesView = selectedView
        ? (selectedView === "low-stock" &&
            item.availableStock < 10 &&
            item.availableStock > 0) ||
          (selectedView === "out-of-stock" && item.availableStock === 0)
        : true;

      return matchesSearch && matchesView;
    });
  }, [inventory, searchTerm, selectedView]);

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Error fetching inventory data
      </div>
    );

  return (
    <div className="mx-auto my-4 w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="border border-gray-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full table-auto">
              <thead className="sticky top-0 bg-white text-lg text-gray-900">
                <tr className="border-b-2 border-gray-900">
                  <th className="py-2 px-4 text-center">SKU</th>
                  <th className="py-2 px-4 text-center">Product Name</th>
                  <th className="py-2 px-4 text-center">Unit Price</th>
                  <th className="py-2 px-4 text-center">Package</th>
                  <th className="py-2 px-4 text-center">Available Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item: InventoryItem) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-600 text-black hover:bg-gray-400 hover:text-white text-center"
                  >
                    <td className="py-2 px-4">{item.sku}</td>
                    <td className="py-2 px-4">{item.Product.title}</td>
                    <td className="py-2 px-4">${item.unitPrice}</td>
                    <td className="py-2 px-4">{item.package.join(", ")}</td>
                    <td className="py-2 px-4">{item.availableStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryPanel: React.FC = () => {
  const inventorySidebarItems = [
    { icon: faWarehouse, label: "All Inventory", id: "all-inventory" },
    { icon: faBox, label: "Low Stock", id: "low-stock" },
    { icon: faBoxOpen, label: "Out of Stock", id: "out-of-stock" },
  ];

  return (
    <AdminPageLayout
      title="Inventory Management"
      sidebarItems={inventorySidebarItems}
    >
      {(selectedItem) => (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            {selectedItem
              ? selectedItem
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              : "All Inventory"}
          </h2>
          <InventoryTable selectedView={selectedItem} />
        </div>
      )}
    </AdminPageLayout>
  );
};

export default InventoryPanel;
