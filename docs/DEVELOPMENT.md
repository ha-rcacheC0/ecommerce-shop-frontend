# Development Guide

This guide covers everything you need to know to develop on the Crew Fireworks frontend.

## Prerequisites

- Node.js 18+ (recommended: use nvm)
- npm 9+
- A running backend API (see backend README)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Biome linter |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Biome |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run tests in watch mode |
| `npm test -- --run` | Run tests once |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |

## Project Structure

```
src/
├── api/                 # API client functions and React Query hooks
│   ├── cart/           # Cart-related queries and mutations
│   ├── products/       # Product queries
│   ├── reports/        # Admin report queries
│   └── user/           # User/auth queries
├── components/          # React components
│   ├── admin-panel-components/  # Admin-only components
│   └── component-parts/         # Reusable UI primitives
├── providers/           # React Context providers
│   ├── auth.provider.tsx
│   └── theme.provider.tsx
├── routes/              # TanStack Router file-based routes
│   ├── _auth/          # Authenticated routes (layout)
│   ├── admin/          # Admin panel routes
│   ├── products/       # Product pages
│   ├── apparel/        # Apparel product pages
│   └── user/           # Login/register pages
├── test/                # Test setup and utilities
└── types.ts             # Shared TypeScript types
```

## Path Aliases

The project uses these TypeScript path aliases:

- `@/` → `src/`
- `@components/` → `src/components/`
- `@api/` → `src/api/`
- `@providers/` → `src/providers/`

Example:
```typescript
import { useAuth } from "@providers/auth.provider";
import type { TProduct } from "@/types";
```

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

For production, this should be your backend URL.

## Code Style

### Linting & Formatting

We use [Biome](https://biomejs.dev/) for linting and formatting.

- **Tabs** for indentation
- **Double quotes** for strings
- Strict TypeScript with no `any` types allowed

Pre-commit hooks automatically:
1. Format and lint staged files
2. Run full TypeScript type checking

### Component Patterns

**Functional Components with TypeScript:**
```typescript
interface ProductCardProps {
  product: TProduct;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // ...
};
```

**Use TanStack Query for data fetching:**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["products", filters],
  queryFn: () => fetchProducts(filters),
});
```

**Use TanStack Router for navigation:**
```typescript
import { Link, useNavigate } from "@tanstack/react-router";

// Declarative
<Link to="/products/$productId" params={{ productId: "123" }}>
  View Product
</Link>

// Programmatic
const navigate = useNavigate();
navigate({ to: "/products" });
```

## Common Tasks

### Adding a New Page

1. Create a new file in `src/routes/` following TanStack Router conventions
2. Export `Route` using `createFileRoute()`
3. The route will be auto-registered in `routeTree.gen.ts`

### Adding a New API Endpoint

1. Create or update files in `src/api/[domain]/`
2. Export query functions and React Query hooks
3. Use in components via the hooks

### Working with Authentication

```typescript
import { useAuth } from "@providers/auth.provider";

const MyComponent = () => {
  const { user, authState } = useAuth();

  if (authState === "loading") return <Loading />;
  if (authState !== "authenticated") return <LoginPrompt />;

  return <AuthenticatedContent user={user} />;
};
```

## Troubleshooting

### "Cannot find module" errors
- Run `npm install`
- Check path alias configuration in `tsconfig.json`

### Type errors in IDE but not in CLI
- Restart TypeScript server in your IDE
- Run `npm run type-check` to verify

### API requests failing
- Check `VITE_API_BASE_URL` is set correctly
- Ensure backend is running
- Check browser console for CORS errors

### Tests failing
- Run `npm test -- --run` for full output
- Check MSW handlers in `src/test/mocks/handlers.ts`
