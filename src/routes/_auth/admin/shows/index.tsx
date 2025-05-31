import { createFileRoute } from "@tanstack/react-router";
import ShowsPanel from "@components/admin-panel-components/ShowsPanel";
import {
  getAllShowsQueryOptions,
  getAllShowTypesQueryOptions,
} from "@api/shows/showsQueries";

export const Route = createFileRoute("/_auth/admin/shows/")({
  component: ShowsPanel,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getAllShowsQueryOptions());
    queryClient.ensureQueryData(getAllShowTypesQueryOptions());
  },
});
