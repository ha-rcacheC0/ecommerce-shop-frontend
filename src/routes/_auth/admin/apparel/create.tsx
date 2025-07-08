import ApparelProductForm from "@/components/admin-panel-components/ApparelProductForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin/apparel/create")({
  component: ApparelProductForm,
});
