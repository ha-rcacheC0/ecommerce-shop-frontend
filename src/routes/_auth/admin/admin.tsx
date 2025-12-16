import {
	getAllShowsQueryOptions,
	getAllShowTypesQueryOptions,
} from "@api/shows/showsQueries";
import ShowsPanel from "@components/admin-panel-components/ShowsPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin/admin")({
	component: ShowsPanel,
	loader: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData(getAllShowsQueryOptions());
		queryClient.ensureQueryData(getAllShowTypesQueryOptions());
	},
});
