import { getAllShowTypesQueryOptions } from "@api/shows/showsQueries";
import ShowTypesManager from "@components/admin-panel-components/ShowTypesManager";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin/shows/showTypes")({
	component: ShowTypesManager,
	loader: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData(getAllShowTypesQueryOptions());
	},
});
