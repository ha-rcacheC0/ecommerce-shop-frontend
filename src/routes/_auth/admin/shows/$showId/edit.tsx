import { createFileRoute } from "@tanstack/react-router";
import ShowForm from "../../../../../components/ShowForm";
import {
  getAllShowTypesQueryOptions,
  getShowByIdQueryOptions,
} from "../../../../../api/shows/showsQueries";
import {
  getAllProductsQueryOptions,
  getProductMetadataQueryOptions,
} from "../../../../../api/products/productsQueries";

export const Route = createFileRoute("/_auth/admin/shows/$showId/edit")({
  component: ShowEditPage,
  loader: ({ context: { queryClient }, params: { showId } }) => {
    queryClient.ensureQueryData(getShowByIdQueryOptions(showId));
    queryClient.ensureQueryData(getAllShowTypesQueryOptions());
    queryClient.ensureQueryData(getProductMetadataQueryOptions());
    queryClient.ensureQueryData(
      getAllProductsQueryOptions({
        page: 1,
        pageSize: 10,
        isShow: false,
      })
    );
  },
});

function ShowEditPage() {
  const { showId } = Route.useParams();
  return <ShowForm showId={showId} isEditing={true} />;
}
