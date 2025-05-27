import { createFileRoute } from "@tanstack/react-router";

import ShowForm from "@/components/admin-panel-components/ShowForm";
import {
  getProductMetadataQueryOptions,
  getAllProductsQueryOptions,
} from "@/api/products/productsQueries";
import {
  getShowByIdQueryOptions,
  getAllShowTypesQueryOptions,
} from "@/api/shows/showsQueries";

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
