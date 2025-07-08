import ApparelAdminPanel from "@/components/admin-panel-components/ApparelAdminPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin/apparel/")({
  component: ApparelAdminPanel,
});
