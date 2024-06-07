import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/profile/cart/')({
  component: () => <div>Hello /_auth/profile/cart/!</div>
})