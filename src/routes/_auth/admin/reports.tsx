import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/admin/reports')({
  component: () => <div>Hello /_auth/admin/reports!</div>
})