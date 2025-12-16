import { ResetPasswordForm } from "@components/ResetPasswordForm";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const resetPasswordSearchSchema = z.object({
	token: z.string().optional(),
});

export const Route = createFileRoute("/user/reset-password")({
	validateSearch: resetPasswordSearchSchema,
	component: ResetPasswordForm,
});
