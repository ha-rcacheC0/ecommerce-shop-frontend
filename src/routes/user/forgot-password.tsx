import { ForgotPasswordForm } from "@components/ForgotPasswordForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/forgot-password")({
	component: ForgotPasswordForm,
});
