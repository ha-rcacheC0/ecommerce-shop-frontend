import { Login } from "@components/LoginForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/login")({
	component: Login,
});
