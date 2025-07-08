import { createFileRoute } from "@tanstack/react-router";
import ProductForm from "@components/admin-panel-components/ProductForm";
import { getProductMetadataQueryOptions } from "@/api/metadata/metadataQueries";

export const Route = createFileRoute("/_auth/admin/products/create")({
  component: () => <ProductForm />,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getProductMetadataQueryOptions());
  },
});
