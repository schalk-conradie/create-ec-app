# EC Power Pages App

React + Vite + TypeScript template tailored for Microsoft Power Pages. It includes Tailwind CSS, a choice of UI library (Kendo UI or Shadcn/ui), TanStack Query, and an authentication context designed for the Power Pages runtime.

## Features

- React + Vite + TypeScript
- Tailwind CSS (Kendo preset when using Kendo UI)
- UI choice: Kendo UI (with theme selection) or Shadcn/ui
- TanStack Query provider configured in `src/main.tsx`
- Power Pages `AuthContext` (`src/context/AuthContext.tsx`) that:
  - Detects `Microsoft.Dynamic365.Portal.User`
  - Retrieves tokens via `window.shell.getTokenDeferred()`
- Example `AuthButton` component in `src/components/shared/AuthButton.tsx`
- Power Pages configuration file `powerpages.config.json`

## Prerequisites

- Node.js 18+ and npm 9+
- Kendo UI license (if applicable)
- Access to a Power Pages site to host the built assets

## Getting Started

- Install dependencies: `npm install`
- Activate Kendo license (if used): `npx kendo-ui-license activate`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Development build (easier debugging): `npm run build:dev`

## Key Files

- `src/context/AuthContext.tsx`: Provides `useAuth()` with `user`, `isAuthenticated`, `tenantId`, `token`, and `refreshToken()`.
- `src/components/shared/AuthButton.tsx`: Sign-in/out button wired for Power Pages.
- `src/services/DataService.ts`: Example service (`getEntity`) using `/_api`.
- `src/main.tsx`: Sets up TanStack Query and, when Kendo UI is selected, imports the chosen Kendo theme CSS.
- `kendo-tw-preset.js` and `tailwind.config.js`: Tailwind + Kendo integration (only present for Kendo projects). For Shadcn/ui, a standard Tailwind config is generated.

## Usage Example

Wrap your app in `AuthProvider` (already done in `App.tsx`):

```tsx
import { useAuth } from '@/context/AuthContext'

export function Profile() {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return null
  return <div>{user?.firstName} {user?.lastName}</div>
}
```

## Deployment

- Upload files from `dist` into your Power Pages site as static content and reference them in your pages as needed.
- The `powerpages.config.json` file indicates output location and landing page; adapt to your project conventions.
