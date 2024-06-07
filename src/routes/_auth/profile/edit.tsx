import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/profile/edit")({
  component: () => <div>Hello /_auth/profile/edit!</div>,
});
