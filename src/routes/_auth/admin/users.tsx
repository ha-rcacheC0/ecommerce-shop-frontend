import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/admin/users')({
  component: () => <div>Hello /_auth/admin/users!</div>
})