import { createFileRoute } from "@tanstack/react-router";
import { RegisterUser } from "../../components/RegisterForm";

export const Route = createFileRoute("/user/register")({
  component: RegisterUser,
});
