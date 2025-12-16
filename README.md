# Crew Fireworks - Frontend

Modern React e-commerce frontend for Crew Fireworks, built with TypeScript, Vite, TanStack Router, and TailwindCSS.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Styling](#styling)
- [Routing](#routing)
- [State Management](#state-management)
- [Troubleshooting](#troubleshooting)

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Routing**: TanStack Router (file-based routing)
- **State Management**: TanStack Query (React Query)
- **Forms**: TanStack Form with Zod validation
- **Styling**: TailwindCSS v4 with DaisyUI components
- **Icons**: FontAwesome
- **Error Tracking**: Sentry (optional)
- **Authentication**: Custom JWT + optional Clerk support

## ✅ Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **bun** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/downloads)
- **Backend API** running (see backend README)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ha-rcacheC0/ecommerce-shop-frontend.git
cd ecommerce-shop-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables) section).

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔐 Environment Variables

Create a `.env` file in the root directory:

### Required Variables

```env
# Backend API URL
VITE_API_BASE_URL="http://localhost:4000/api"
```

### Optional Variables

```env
# Sentry Error Tracking (leave blank to disable)
SENTRY_AUTH_TOKEN=""

# Clerk Authentication (if using Clerk instead of JWT)
VITE_CLERK_PUBLISHABLE_KEY=""
```

### Environment-Specific Configuration

**Development (.env or .env.development)**
```env
VITE_API_BASE_URL="http://localhost:4000/api"
```

**Production (.env.production)**
```env
VITE_API_BASE_URL="https://crew-fireworks-api.fly.dev/api"
```

## 💻 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint

# Type-check TypeScript
npm run type-check

# Build with type checking
tsc && vite build
```

### Development Workflow

1. **Start backend API** first (see backend README)
2. **Start frontend dev server**: `npm run dev`
3. **Make changes** - Hot Module Replacement (HMR) updates instantly
4. **Check types**: TypeScript errors shown in terminal and IDE
5. **Commit changes** - Pre-commit hooks automatically lint your code

### Code Quality & Pre-Commit Hooks

This project uses **Husky** and **lint-staged** to automatically enforce code quality standards.

#### What Runs Automatically

Every time you commit code, the following checks run automatically:

1. **ESLint** - Lints all staged `.ts` and `.tsx` files and auto-fixes issues
   - Enforces React best practices
   - Warns about unused variables and imports
   - Auto-fixes formatting where possible

If the linting fails, your commit will be blocked until you fix the errors.

#### Manual Code Quality Checks

```bash
# Check for linting errors
npm run lint

# Run TypeScript type checking
npm run type-check

# Build with type checking (runs tsc before vite build)
npm run build
```

#### Bypassing Pre-Commit Hooks

**⚠️ Not recommended**, but if you absolutely need to bypass the hooks:

```bash
git commit --no-verify -m "your message"
```

Only use this in emergencies. Your code should pass all checks before committing.

#### Key Quality Features

- **TypeScript strict mode** for maximum type safety
- **ESLint** with React and TypeScript rules
- **Path aliases** for clean imports (`@components`, `@api`, `@providers`)
- **TanStack Router** for type-safe routing
- **Pino logger** for structured browser logging

## 📁 Project Structure

```
ecommerce-shop-frontend/
├── public/
│   ├── imgs/              # Static images
│   └── helcimPay.min.js   # Helcim payment widget
├── src/
│   ├── api/               # API client functions & React Query hooks
│   │   ├── cart/
│   │   ├── products/
│   │   ├── apparel/
│   │   ├── shows/
│   │   └── users/
│   ├── components/        # Reusable React components
│   │   ├── component-parts/    # Small reusable pieces
│   │   ├── admin-panel-components/  # Admin UI
│   │   ├── cart.tsx
│   │   ├── navbar.tsx
│   │   └── ...
│   ├── providers/         # React Context providers
│   │   ├── auth.provider.tsx
│   │   └── theme.provider.tsx
│   ├── routes/           # File-based routing (TanStack Router)
│   │   ├── __root.tsx    # Root layout
│   │   ├── index.lazy.tsx  # Home page
│   │   ├── products/
│   │   ├── apparel/
│   │   ├── shows/
│   │   ├── _auth/        # Protected routes
│   │   └── ...
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles & Tailwind
├── .env                  # Environment variables (DO NOT COMMIT)
├── .env.example          # Example environment variables
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # TailwindCSS configuration
└── README.md            # This file
```

## 🎨 Styling

### TailwindCSS + DaisyUI

The app uses TailwindCSS v4 with DaisyUI components for consistent styling.

**Theme Support:**
- Light and dark modes
- Auto-detection of system preference
- Manual theme toggle
- Theme persisted to localStorage

**Using DaisyUI Components:**
```tsx
<button className="btn btn-primary">Click Me</button>
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">Content</div>
</div>
```

**Common Utility Classes:**
```tsx
// Responsive design
<div className="grid md:grid-cols-2 lg:grid-cols-3">

// Theme-aware colors
<div className="bg-base-100 text-base-content">

// Spacing
<div className="p-4 mt-6 gap-4">
```

### Custom Styling

Global styles are in `src/index.css`. Component-specific styles use Tailwind utility classes.

## 🧭 Routing

### TanStack Router (File-Based)

Routes are automatically generated from the `src/routes/` directory structure:

```
routes/
├── index.lazy.tsx          →  /
├── products/
│   ├── index.tsx          →  /products
│   └── $productId/
│       └── route.tsx      →  /products/:productId
├── apparel/
│   ├── index.tsx          →  /apparel
│   └── $productId/
│       └── route.tsx      →  /apparel/:productId
└── _auth/                 →  Protected routes
    └── profile/
        └── index.tsx      →  /profile (requires login)
```

### Navigation

```tsx
import { Link, useNavigate } from "@tanstack/react-router";

// Link component
<Link to="/products" search={{ page: 1 }}>Products</Link>

// Programmatic navigation
const navigate = useNavigate();
navigate({ to: "/cart" });
```

### Route Parameters

```tsx
import { useParams } from "@tanstack/react-router";

const { productId } = useParams({ from: "/products/$productId" });
```

### Protected Routes

Routes in `_auth/` directory require authentication. Unauthenticated users are redirected to login.

## 📊 State Management

### TanStack Query (React Query)

Used for server state management, caching, and data fetching.

**Query Example:**
```tsx
import { useQuery } from "@tanstack/react-query";
import { cartItemsQueryOptions } from "@api/cart/cartQueries";

const { data, isLoading, error } = useQuery(
  cartItemsQueryOptions(cartId, enabled)
);
```

**Mutation Example:**
```tsx
import { useMutation } from "@tanstack/react-query";

const { mutate, isPending } = useMutation({
  mutationFn: addToCart,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  },
});
```

### Context Providers

**AuthProvider** - Handles authentication state:
```tsx
import { useAuth } from "@providers/auth.provider";

const { user, authState, login, logout } = useAuth();
```

**ThemeProvider** - Manages theme switching:
```tsx
import { useTheme } from "@providers/theme.provider";

const { theme, toggleTheme } = useTheme();
```

## 🔑 Key Features

### Product Catalog
- Searchable product listings with filters
- Product detail pages with images
- Category and brand filtering
- Case/unit pricing for wholesale

### Apparel Products
- Size and color variant selection
- Gender-specific filtering
- SKU-based inventory tracking

### Fireworks Shows
- Pre-packaged show bundles
- Free shipping on show purchases
- Detailed show contents

### Shopping Cart
- Add/remove/update quantities
- Case and unit quantities
- Automatic shipping calculation
- Tax calculation by state
- Lift gate fee option
- Terminal shipping option

### Payment Integration
- Helcim embedded payment widget
- Secure checkout flow
- Order confirmation emails

### User Profile
- Order history
- Multiple shipping addresses
- Profile management

### Admin Panel
- Product management
- Inventory tracking
- Order management
- Reports generation

## 🎯 Import Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```tsx
// Instead of: import Navbar from '../../../components/navbar'
import Navbar from '@components/navbar';

// Available aliases:
import { api } from '@api/...';
import Component from '@components/...';
import { useAuth } from '@providers/...';
import { SomeUtil } from '@/utils/...';
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Vite default port is 5173
# If in use, Vite will automatically try 5174, 5175, etc.

# Or specify a custom port:
npm run dev -- --port 3000
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

### TypeScript Errors

```bash
# Run type-check to see all errors
tsc --noEmit

# Check tsconfig.json paths are correct
```

### API Connection Errors

- Verify backend is running on the port specified in `VITE_API_BASE_URL`
- Check for CORS issues in backend configuration
- Ensure backend allows requests from `http://localhost:5173`

### Build Errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear dist folder
rm -rf dist

# Rebuild
npm run build
```

### Routing Issues

```bash
# Regenerate TanStack Router types
npm run dev
# Routes are auto-generated on dev server start
```

## 🚢 Deployment

The application is deployed on Fly.io.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploy to Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy
fly deploy
```

### Environment Variables on Fly.io

Set secrets in `fly.toml` or via Fly CLI:
```bash
fly secrets set VITE_API_BASE_URL="https://crew-fireworks-api.fly.dev/api"
```

## 📝 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run linter: `npm run lint`
4. Run type-check: `tsc --noEmit`
5. Commit with descriptive messages
6. Push and create a pull request

## 📄 License

See LICENSE file for details.

## 👥 Support

For questions or issues:
- Create an issue in the GitHub repository
- Contact the development team
