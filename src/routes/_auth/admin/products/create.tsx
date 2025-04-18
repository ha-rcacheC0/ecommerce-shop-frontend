import { createFileRoute } from "@tanstack/react-router";
import ProductForm from "../../../../components/ProductForm";
import { getProductMetadataQueryOptions } from "../../../../api/products/productsQueries";

export const Route = createFileRoute("/_auth/admin/products/create")({
  component: () => <ProductForm />,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getProductMetadataQueryOptions());
  },
});
