import { createFileRoute } from "@tanstack/react-router";
import ProductsPanel from "@components/admin-panel-components/ProductsPanel";
import { getAllProductsQueryOptions } from "@api/products/productsQueries";

export const Route = createFileRoute("/_auth/admin/products/")({
  component: ProductsPanel,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      getAllProductsQueryOptions({
        page: 1,
        pageSize: 25,
        isShow: false,
      })
    );
  },
});
