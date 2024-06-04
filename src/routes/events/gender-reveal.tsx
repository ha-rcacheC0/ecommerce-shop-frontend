import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/gender-reveal')({
  component: () => <div>Hello /events/gender-reveal!</div>
})