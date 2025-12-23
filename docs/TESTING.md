# Testing Guide

This guide covers the testing infrastructure and patterns used in the Crew Fireworks frontend.

## Testing Stack

- **Vitest** - Test runner (fast, Vite-native)
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking
- **jsdom** - Browser environment simulation

## Running Tests

```bash
# Watch mode (recommended during development)
npm test

# Run once (CI/pre-commit)
npm test -- --run

# With coverage report
npm run test:coverage

# Visual UI (great for debugging)
npm run test:ui
```

## Test Structure

```
src/
├── test/
│   ├── setup.ts           # Test setup (runs before all tests)
│   ├── vitest-env.d.ts    # Vitest type declarations
│   ├── mocks/
│   │   ├── handlers.ts    # MSW request handlers
│   │   └── server.ts      # MSW server setup
│   └── utils/
│       └── testUtils.tsx  # Custom render utilities
└── components/
    └── cart.test.tsx      # Component test file
```

## Writing Tests

### Basic Component Test

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductCard } from "./ProductCard";

describe("ProductCard", () => {
  it("displays product title", () => {
    const product = { id: "1", title: "Test Product", /* ... */ };

    render(<ProductCard product={product} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });
});
```

### Testing with Providers

Use the custom `renderWithProviders` utility for components that need context:

```typescript
import { renderWithProviders } from "@/test/utils/testUtils";

it("shows add to cart button when authenticated", () => {
  renderWithProviders(<ProductCard product={mockProduct} />, {
    authState: "authenticated",
    user: mockUser,
  });

  expect(screen.getByRole("button", { name: /add to cart/i })).toBeEnabled();
});
```

### Testing User Interactions

```typescript
import userEvent from "@testing-library/user-event";

it("adds product to cart on button click", async () => {
  const user = userEvent.setup();

  render(<ProductCard product={mockProduct} />);

  await user.click(screen.getByRole("button", { name: /add case/i }));

  expect(mockAddToCart).toHaveBeenCalledWith({
    productId: mockProduct.id,
    isUnit: false,
  });
});
```

### Testing Async Behavior

```typescript
import { waitFor } from "@testing-library/react";

it("shows loading state then data", async () => {
  render(<ProductList />);

  // Initially shows loading
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Eventually shows products
  await waitFor(() => {
    expect(screen.getByText("Product 1")).toBeInTheDocument();
  });
});
```

## Mocking APIs with MSW

### Adding a Mock Handler

Edit `src/test/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from "msw";

export const handlers = [
  // GET request
  http.get("/api/products", () => {
    return HttpResponse.json([
      { id: "1", title: "Product 1" },
      { id: "2", title: "Product 2" },
    ]);
  }),

  // POST request
  http.post("/api/cart/add", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, cartId: body.cartId });
  }),

  // Error response
  http.get("/api/products/:id", ({ params }) => {
    if (params.id === "not-found") {
      return HttpResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json({ id: params.id, title: "Test Product" });
  }),
];
```

### Override Handlers in Specific Tests

```typescript
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";

it("handles API error gracefully", async () => {
  // Override the default handler for this test only
  server.use(
    http.get("/api/products", () => {
      return HttpResponse.json(
        { error: "Server error" },
        { status: 500 }
      );
    })
  );

  render(<ProductList />);

  await waitFor(() => {
    expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
  });
});
```

## Test Patterns

### Testing Forms

```typescript
it("submits form with valid data", async () => {
  const user = userEvent.setup();

  render(<LoginForm onSubmit={mockSubmit} />);

  await user.type(screen.getByLabelText(/email/i), "test@example.com");
  await user.type(screen.getByLabelText(/password/i), "password123");
  await user.click(screen.getByRole("button", { name: /sign in/i }));

  expect(mockSubmit).toHaveBeenCalledWith({
    email: "test@example.com",
    password: "password123",
  });
});
```

### Testing Conditional Rendering

```typescript
it("shows login prompt when not authenticated", () => {
  renderWithProviders(<CartButton />, { authState: "unauthenticated" });

  expect(screen.getByText(/please sign in/i)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /add/i })).not.toBeInTheDocument();
});

it("shows add button when authenticated", () => {
  renderWithProviders(<CartButton />, {
    authState: "authenticated",
    user: mockUser,
  });

  expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
});
```

### Testing Loading States

```typescript
it("shows skeleton while loading", () => {
  render(<ProductDetail productId="1" />);

  expect(screen.getByTestId("product-skeleton")).toBeInTheDocument();
});

it("shows content after loading", async () => {
  render(<ProductDetail productId="1" />);

  await waitFor(() => {
    expect(screen.queryByTestId("product-skeleton")).not.toBeInTheDocument();
  });

  expect(screen.getByText("Test Product")).toBeInTheDocument();
});
```

## Debugging Tests

### Using Vitest UI

```bash
npm run test:ui
```

Opens a browser interface where you can:
- See all tests organized by file
- Run individual tests
- View test output and errors
- Debug with browser DevTools

### Debug Output

```typescript
import { screen } from "@testing-library/react";

it("debugging example", () => {
  render(<MyComponent />);

  // Print the current DOM to console
  screen.debug();

  // Print specific element
  screen.debug(screen.getByRole("button"));
});
```

### Common Issues

**"Unable to find element"**
- Check if the element is rendered (use `screen.debug()`)
- Verify the query selector (role, text, testId)
- Check if async rendering requires `waitFor`

**"act() warning"**
- Wrap state updates in `await waitFor()` or `await user.click()`
- Use `userEvent.setup()` at test start

**MSW not intercepting requests**
- Verify server is started in `setup.ts`
- Check handler URL matches exactly
- Log requests: `server.events.on('request:start', ...)`

## Coverage

Run coverage report:

```bash
npm run test:coverage
```

Coverage reports are generated in:
- Terminal summary
- `coverage/` folder (HTML report)

Open `coverage/index.html` in a browser for detailed view.

### Coverage Thresholds

Consider adding to `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    lines: 70,
    functions: 70,
    branches: 70,
    statements: 70,
  }
}
```
