import { createFileRoute } from "@tanstack/react-router";
import ShowTypesManager from "../../../../components/ShowTypesManager";
import { getAllShowTypesQueryOptions } from "../../../../api/shows/showsQueries";

export const Route = createFileRoute("/_auth/admin/shows/showTypes")({
  component: ShowTypesManager,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(getAllShowTypesQueryOptions());
  },
});
