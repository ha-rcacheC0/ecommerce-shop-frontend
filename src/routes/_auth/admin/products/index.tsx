import { getAllProductsQueryOptions } from "@api/products/productsQueries";
import ProductsPanel from "@components/admin-panel-components/ProductsPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin/products/")({
	component: ProductsPanel,
	loader: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData(
			getAllProductsQueryOptions({
				page: 1,
				pageSize: 25,
				isShow: false,
			}),
		);
	},
});
