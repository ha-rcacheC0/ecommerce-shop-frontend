import { createFileRoute } from "@tanstack/react-router";
import ReportPanel from "@components/admin-panel-components/ReportPanel";

export const Route = createFileRoute("/_auth/admin/reports")({
  component: ReportPanel,
});
