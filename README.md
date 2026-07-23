# Frontend

React + Vite single-page application.

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9 (or pnpm / yarn)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`. API requests to `/api/*` are proxied to the
backend at `VITE_API_BASE_URL` (default `http://localhost:8000`).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across all source files |
| `npm test` | Run Jest unit / component tests |
| `npm run test:coverage` | Run tests with coverage report |

---

## Environment Variables

All variables must be prefixed with `VITE_` to be exposed to the browser bundle.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | Yes | `http://localhost:8000` | Backend API base URL |
| `VITE_APP_TITLE` | No | `App` | Browser tab title |
| `VITE_ENABLE_ANALYTICS` | No | `false` | Toggle analytics |

Copy `.env.example` to `.env` and adjust values before running the dev server. The `.env` file is
git-ignored and must never be committed.

---

## Project Structure

```
src/
├── assets/
│   ├── icons/          # SVG icon assets
│   └── images/         # SVG / raster image assets
├── components/         # Shared UI components
├── config/
│   └── tailwind.config.js  # Design token extensions (imported by root tailwind.config.js)
├── features/           # Feature-scoped modules (pages, hooks, services)
├── hooks/              # Global custom React hooks
├── lib/
│   ├── axios.js        # Axios instance configured with VITE_API_BASE_URL
│   └── queryClient.js  # @tanstack/react-query QueryClient instance
├── routes/             # React Router route definitions
├── __mocks__/          # Jest module mocks (fileMock.js for assets)
└── main.jsx            # Application entry point
```

---

## Design Token Usage

Design tokens are defined in `src/config/tailwind.config.js` and merged into the root
`tailwind.config.js`. They extend Tailwind's default theme.

### Colours

Use semantic colour utilities such as `bg-primary`, `text-primary`, `border-primary`, etc.
All colour values are sourced from the token file — never hard-code hex values in components.

### Typography

Font families, sizes, and weights are exposed as Tailwind utilities:

```jsx
<h1 className="font-heading text-3xl font-bold text-gray-900">Heading</h1>
<p className="font-body text-base text-gray-700">Body copy</p>
```

### Spacing & Sizing

Use Tailwind's default spacing scale. Custom spacing tokens (if any) are defined in the
`extend.spacing` section of the token config.

### Utility Helpers

Use `clsx` + `tailwind-merge` via the project's `cn()` helper for conditional class composition:

```jsx
import { cn } from '@/lib/utils';

<button className={cn('px-4 py-2 rounded', isActive && 'bg-primary text-white')}>
  Click me
</button>
```

---

## Route Map

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Landing / home page |
| `/products` | `ProductListPage` | Browse product catalogue |
| `/products/:id` | `ProductDetailPage` | Individual product detail |
| `/cart` | `CartPage` | Shopping cart |
| `/checkout` | `CheckoutPage` | Checkout flow |
| `/orders` | `OrderListPage` | User order history |
| `/orders/:id` | `OrderDetailPage` | Individual order detail |
| `/account` | `AccountPage` | User account settings |
| `/login` | `LoginPage` | Authentication – sign in |
| `/register` | `RegisterPage` | Authentication – sign up |
| `*` | `NotFoundPage` | 404 fallback |

---

## Available Assets

Import assets using the `@/assets/` alias:

```jsx
import logo from '@/assets/images/logo.svg';
import CartIcon from '@/assets/icons/cart.svg';
```

### Images
- `@/assets/images/logo.svg`
- `@/assets/images/placeholder-product.svg`
- `@/assets/images/empty-state.svg`

### Icons
- `@/assets/icons/menu.svg`
- `@/assets/icons/close.svg`
- `@/assets/icons/search.svg`
- `@/assets/icons/cart.svg`
- `@/assets/icons/user.svg`
- `@/assets/icons/bell.svg`
- `@/assets/icons/heart.svg`
- `@/assets/icons/star.svg`
- `@/assets/icons/chevron-down.svg`
- `@/assets/icons/chevron-left.svg`
- `@/assets/icons/chevron-right.svg`
- `@/assets/icons/check.svg`
- `@/assets/icons/trash.svg`
- `@/assets/icons/edit.svg`
- `@/assets/icons/plus.svg`
- `@/assets/icons/minus.svg`
- `@/assets/icons/external-link.svg`
- `@/assets/icons/map-pin.svg`
- `@/assets/icons/package.svg`

---

## Code Style

- ESLint enforces React, import-order, and accessibility (jsx-a11y) rules.
- Run `npm run lint` before committing.
- All components must have meaningful `aria-*` attributes where interactive.
- Images must always include a descriptive `alt` attribute.
