import React from "react";
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
  Product: {
    title: string;
  };
  unitPrice: number;
  package: string[];
  availableStock: number;
}

const InventoryTable: React.FC<{ selectedView: string | null }> = ({
  selectedView,
}) => {
  const {
    data: inventory,
    isLoading,
    isError,
  } = useQuery(getAllItemsInInventoryQueryOptions());

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Error fetching inventory data
      </div>
    );

  // Filter inventory based on selectedView
  const filteredInventory = selectedView
    ? inventory.filter((item: InventoryItem) => {
        switch (selectedView) {
          case "low-stock":
            return item.availableStock < 10 && item.availableStock > 0; // Adjust this threshold as needed
          case "out-of-stock":
            return item.availableStock === 0;
          default:
            return true;
        }
      })
    : inventory;

  return (
    <div className="overflow-x-auto mx-auto my-4 w-full">
      <table className="min-w-full border border-gray-900 table">
        <thead className="text-lg text-gray-900 border-gray-900 border-b-2">
          <tr>
            <th className="py-2 text-center">SKU</th>
            <th className="py-2 text-center">Product Name</th>
            <th className="py-2 text-center">Unit Price</th>
            <th className="py-2 text-center">Package</th>
            <th className="py-2 text-center">Available Stock</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item: InventoryItem) => (
            <tr
              key={item.id}
              className="border-t border-gray-600 text-black hover:bg-gray-400 hover:text-white text-center"
            >
              <td className="py-2">{item.sku}</td>
              <td className="py-2">{item.Product.title}</td>
              <td className="py-2">${item.unitPrice}</td>
              <td className="py-2">{item.package.join(", ")}</td>
              <td className="py-2">{item.availableStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
