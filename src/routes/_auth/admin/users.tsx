import UsersScreen from "@components/admin-panel-components/UsersPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin/users")({
	component: UsersScreen,
});
