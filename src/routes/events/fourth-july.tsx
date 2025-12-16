import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/events/fourth-july")({
	component: () => <div>Hello /events/fourth-july!</div>,
});
