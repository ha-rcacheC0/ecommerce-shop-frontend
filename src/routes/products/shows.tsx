import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/shows')({
  component: () => <div>Hello /products/shows!</div>
})