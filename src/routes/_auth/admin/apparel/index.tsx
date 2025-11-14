import { createFileRoute } from "@tanstack/react-router";
import ApparelAdminPanel from "@/components/admin-panel-components/ApparelAdminPanel";

export const Route = createFileRoute("/_auth/admin/apparel/")({
	component: ApparelAdminPanel,
});
