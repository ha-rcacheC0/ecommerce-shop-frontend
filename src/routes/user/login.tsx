import { createFileRoute } from "@tanstack/react-router";
import { Login } from "@components/LoginForm";

export const Route = createFileRoute("/user/login")({
  component: Login,
});
