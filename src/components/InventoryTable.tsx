import { useQuery } from "@tanstack/react-query";
import { getAllItemsInInventoryQueryOptions } from "../api/admin/inventoryQueries";

const InventoryTable = () => {
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

  return (
    <div className="overflow-x-auto mx-auto my-4 w-1/2">
      <table className="min-w-full border border-gray-300 table">
        <thead className="">
          <tr>
            <th className="px-4 py-2 text-left">SKU</th>
            <th className="px-4 py-2 text-left">Product Name</th>
            <th className="px-4 py-2 text-left">Unit Price</th>
            <th className="px-4 py-2 text-left">Package</th>
            <th className="px-4 py-2 text-left">Available Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr
              key={item.id}
              className="border-t border-gray-300 hover:bg-gray-50 hover:text-black"
            >
              <td className="px-4 py-2">{item.sku}</td>
              <td className="px-4 py-2">{item.Product.title}</td>
              <td className="px-4 py-2">${item.unitPrice}</td>
              <td className="px-4 py-2">{item.package.join(", ")}</td>
              <td className="px-4 py-2">{item.availableStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
