import { createFileRoute } from "@tanstack/react-router";
import { getInventoryQueryOptions } from "../../../api/admin/inventoryQueries";

import InventoryPanel from "../../../components/InventoryPanel";

export const Route = createFileRoute("/_auth/admin/inventory")({
  component: InventoryPanel,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      getInventoryQueryOptions({
        page: 1,
        pageSize: 10,
        search: "",
        view: null,
      })
    );
  },
});
