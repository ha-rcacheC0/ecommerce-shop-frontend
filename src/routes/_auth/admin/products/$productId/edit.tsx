import { createFileRoute } from "@tanstack/react-router";
import { getProductMetadataQueryOptions } from "@/api/metadata/metadataQueries";
import { getOneProductQueryOptions } from "@/api/products/productsQueries";
import ProductForm from "@/components/admin-panel-components/ProductForm";

export const Route = createFileRoute("/_auth/admin/products/$productId/edit")({
	component: ProductEditPage,
	loader: ({ context: { queryClient }, params: { productId } }) => {
		queryClient.ensureQueryData(getProductMetadataQueryOptions());
		queryClient.ensureQueryData(getOneProductQueryOptions({ id: productId }));
	},
});

function ProductEditPage() {
	const { productId } = Route.useParams();
	return <ProductForm productId={productId} isEditing={true} />;
}
