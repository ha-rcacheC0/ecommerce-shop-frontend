import { createFileRoute } from "@tanstack/react-router";
import { getAllItemsInInventoryQueryOptions } from "../../../api/admin/inventoryQueries";

import InventoryPanel from "../../../components/InventoryPanel";

export const Route = createFileRoute("/_auth/admin/inventory")({
  component: InventoryPanel,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getAllItemsInInventoryQueryOptions());
  },
});
