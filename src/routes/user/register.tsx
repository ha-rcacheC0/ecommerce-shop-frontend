import { RegisterUser } from "@components/RegisterForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/register")({
	component: RegisterUser,
});
