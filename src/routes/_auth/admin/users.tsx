import { createFileRoute } from "@tanstack/react-router";
import UsersScreen from "@components/admin-panel-components/UsersPanel";

export const Route = createFileRoute("/_auth/admin/users")({
  component: UsersScreen,
});
