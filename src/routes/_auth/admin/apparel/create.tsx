import { createFileRoute } from "@tanstack/react-router";
import ApparelProductForm from "@/components/admin-panel-components/ApparelProductForm";

export const Route = createFileRoute("/_auth/admin/apparel/create")({
	component: ApparelProductForm,
});
