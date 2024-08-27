import { createFileRoute } from "@tanstack/react-router";
import { getAllItemsInInventoryQueryOptions } from "../../../api/admin/inventoryQueries";
import InventoryTable from "../../../components/InventoryTable";

export const Route = createFileRoute("/_auth/admin/inventory")({
  component: () => <InventoryTable />,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getAllItemsInInventoryQueryOptions());
  },
});
