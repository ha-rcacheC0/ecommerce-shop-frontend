import LoadingScreen from "@components/LoadingScreen"; // Import the LoadingScreen component using default import syntax
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ context, location }) => {
		if (context.auth.authState !== "authenticated") {
			throw redirect({
				to: "/",
				search: {
					redirect: location.href,
				},
			});
		}
	},

	pendingComponent: () => <LoadingScreen />,

	component: () => <Outlet />,
});
