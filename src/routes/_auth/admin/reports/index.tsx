import ReportPanel from "@components/admin-panel-components/ReportPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin/reports/")({
	component: ReportPanel,
});
