import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/events/new-years")({
  component: () => <div>Hello /events/new-years!</div>,
});
