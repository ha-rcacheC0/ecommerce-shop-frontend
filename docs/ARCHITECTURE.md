# Architecture Overview

This document describes the technical architecture of the Crew Fireworks frontend application.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript (strict mode) |
| Build Tool | Vite 6 |
| Routing | TanStack Router |
| Data Fetching | TanStack Query |
| Forms | TanStack Form + Zod |
| Styling | TailwindCSS v4 + DaisyUI |
| Testing | Vitest + React Testing Library |
| Error Monitoring | Sentry |

## Application Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        React App                            │
├─────────────────────────────────────────────────────────────┤
│  Providers                                                  │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ AuthProvider│ │ThemeProvider │ │ QueryClientProvider  │ │
│  └─────────────┘ └──────────────┘ └──────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  TanStack Router                                            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Routes (file-based)                                    ││
│  │  ├── / (home)                                          ││
│  │  ├── /products                                         ││
│  │  ├── /apparel                                          ││
│  │  ├── /user (login, register)                           ││
│  │  ├── /_auth (protected layout)                         ││
│  │  │   ├── /profile                                      ││
│  │  │   └── /cart                                         ││
│  │  └── /admin (admin layout)                             ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Components                                                 │
│  ┌──────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ Page Routes  │ │ Domain         │ │ UI Primitives    │  │
│  │ (src/routes) │ │ Components     │ │ (component-parts)│  │
│  └──────────────┘ └────────────────┘ └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (TanStack Query)                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  API Hooks & Query Functions (src/api)                  ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                     Backend API                             │
└─────────────────────────────────────────────────────────────┘
```

## Core Patterns

### 1. Data Fetching with TanStack Query

All API calls go through TanStack Query for:
- Automatic caching
- Background refetching
- Loading/error state management
- Optimistic updates

```typescript
// Query hook (read)
const { data, isLoading, error } = useQuery({
  queryKey: ["products", categoryId],
  queryFn: () => fetchProducts(categoryId),
});

// Mutation hook (write)
const mutation = useMutation({
  mutationFn: addToCart,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  },
});
```

### 2. File-Based Routing

Routes are defined by file structure in `src/routes/`:

| File Path | Route |
|-----------|-------|
| `index.tsx` | `/` |
| `products/index.tsx` | `/products` |
| `products/$productId/route.tsx` | `/products/:productId` |
| `_auth/profile/index.tsx` | `/profile` (protected) |

Special conventions:
- `_auth/` prefix = requires authentication
- `$param` = dynamic route parameter
- `index.tsx` = route root

### 3. Context Providers

**AuthProvider** (`src/providers/auth.provider.tsx`)
- Manages user authentication state
- Provides `useAuth()` hook
- States: `loading` | `authenticated` | `unauthenticated`

**ThemeProvider** (`src/providers/theme.provider.tsx`)
- Manages DaisyUI theme selection
- Persists to localStorage
- Provides `useThemeProvider()` hook

### 4. Component Organization

```
components/
├── ProductCard.tsx           # Domain component
├── ApparelProductCard.tsx    # Domain component
├── ShowCard.tsx              # Domain component
├── admin-panel-components/   # Admin-only components
│   ├── ProductsPanel.tsx
│   ├── UsersPanel.tsx
│   └── SalesReport.tsx
└── component-parts/          # Reusable UI primitives
    ├── Modal.tsx
    ├── PageButtons.tsx
    ├── DataTable.tsx
    └── FilterPanel.tsx
```

## Data Flow

### Read Flow (Query)

```
User Action → Route Loader/Component
                    ↓
            TanStack Query Hook
                    ↓
              Query Function
                    ↓
              Backend API
                    ↓
              Query Cache
                    ↓
            Component Render
```

### Write Flow (Mutation)

```
User Action → Component Handler
                    ↓
            TanStack Mutation
                    ↓
              Mutation Function
                    ↓
              Backend API
                    ↓
         Invalidate Queries (cache bust)
                    ↓
            Refetch affected queries
                    ↓
            Component Re-render
```

## State Management

| State Type | Solution |
|-----------|----------|
| Server State | TanStack Query |
| URL State | TanStack Router search params |
| Auth State | React Context (AuthProvider) |
| Theme State | React Context (ThemeProvider) |
| Form State | TanStack Form |
| UI State | React useState (local) |

### Server State (TanStack Query)

Products, cart, user data - anything from the API:

```typescript
const { data: products } = useQuery(getProductsQueryOptions(filters));
const { data: cart } = useQuery(getCartQueryOptions(cartId));
```

### URL State (Router Search Params)

Filters, pagination, sorting - shareable via URL:

```typescript
// Reading
const { page, category } = useSearch({ from: "/products" });

// Writing
navigate({
  to: "/products",
  search: { page: 2, category: "500-gram" },
});
```

## Error Handling

### API Errors

TanStack Query provides error states:

```typescript
const { data, error, isError } = useQuery(/*...*/);

if (isError) {
  return <ErrorMessage error={error} />;
}
```

### Global Error Boundary

Sentry captures unhandled errors:

```typescript
// src/main.tsx
<Sentry.ErrorBoundary fallback={<p>Something went wrong</p>}>
  <App />
</Sentry.ErrorBoundary>
```

### Form Validation

Zod schemas validate before submission:

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// TanStack Form integrates with Zod
const form = useForm({
  validatorAdapter: zodValidator,
  validators: { onChange: schema },
});
```

## Authentication Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ User Login  │───▶│ AuthProvider │───▶│ Store JWT   │
│   Form      │    │ authenticate │    │ in memory   │
└─────────────┘    └──────────────┘    └─────────────┘
                          │
                          ▼
               ┌──────────────────┐
               │ Update authState │
               │ to "authenticated"│
               └──────────────────┘
                          │
                          ▼
               ┌──────────────────┐
               │ Refetch user     │
               │ queries          │
               └──────────────────┘
```

Protected routes check auth state:

```typescript
// In _auth layout
const { authState } = useAuth();

if (authState === "loading") return <Loading />;
if (authState !== "authenticated") {
  return <Navigate to="/user/login" />;
}

return <Outlet />;
```

## Performance Considerations

### Code Splitting

Vite automatically splits by route. Each route chunk loads on demand.

### Query Caching

TanStack Query caches responses:
- `staleTime`: How long before refetch
- `gcTime`: How long to keep in cache

### Image Optimization

- Use appropriate image sizes
- Lazy load off-screen images
- Consider using WebP format

### Bundle Analysis

```bash
npm run build
# Check dist/ folder sizes
```

## Security

### XSS Prevention

- React escapes content by default
- Avoid `dangerouslySetInnerHTML`

### Authentication

- JWT stored in memory (not localStorage)
- HTTPS in production
- CORS configured on backend

### Input Validation

- Zod validates form inputs
- Backend validates all requests

## Monitoring

### Sentry Integration

Configured in `src/main.tsx`:
- Captures unhandled errors
- Browser tracing for performance
- Session replay for debugging
- Domain-tagged errors (cart, profile, products, admin)
