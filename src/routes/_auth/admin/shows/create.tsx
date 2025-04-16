import { createFileRoute } from "@tanstack/react-router";
import ShowForm from "../../../../components/ShowForm";
import { getAllShowTypesQueryOptions } from "../../../../api/shows/showsQueries";
import { getAllProductsQueryOptions } from "../../../../api/products/productsQueries";

export const Route = createFileRoute("/_auth/admin/shows/create")({
  component: ShowForm,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getAllShowTypesQueryOptions());
    queryClient.ensureQueryData(
      getAllProductsQueryOptions({ page: 1, pageSize: 100 })
    );
  },
});
