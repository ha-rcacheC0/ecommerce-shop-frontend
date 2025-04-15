import { createFileRoute } from "@tanstack/react-router";
import EditShowForm from "../../../../../components/EditShowForm";
import {
  getAllShowTypesQueryOptions,
  getShowByIdQueryOptions,
} from "../../../../../api/shows/showsQueries";
import { getAllProductsQueryOptions } from "../../../../../api/products/productsQueries";

export const Route = createFileRoute("/_auth/admin/shows/$showId/edit")({
  component: ShowEditPage,
  loader: ({ context: { queryClient }, params: { showId } }) => {
    queryClient.ensureQueryData(getShowByIdQueryOptions(showId));
    queryClient.ensureQueryData(getAllShowTypesQueryOptions());
    queryClient.ensureQueryData(
      getAllProductsQueryOptions({ page: 1, pageSize: 100 })
    );
  },
});

function ShowEditPage() {
  const { showId } = Route.useParams();
  return <EditShowForm showId={showId} />;
}
