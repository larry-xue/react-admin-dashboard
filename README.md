# React Admin Dashboard

> Production-ready SaaS admin template built with React 19, TypeScript 6, Vite 8, and Ant Design v6.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://react-admin-dashboard-gamma-six.vercel.app/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.1-purple)](https://vite.dev/)

---

## Overview

| Why it matters | How it helps |
| --- | --- |
| ⚡️ Modern stack | React 19 + Vite 8 + TypeScript 6 = instant HMR and full type safety |
| 🎨 Polished UI | Ant Design v6 components, theme switcher, and adaptive layouts |
| 🔐 Real workflows | Auth, protected routes, SaaS dashboard, and customer lifecycle management |
| 🧱 Strong DX | File-based routing, lazy route loading, Zustand stores, mock APIs, and zero-config startup |

### SaaS Demo Modules
- **Dashboard** – KPI cards, lightweight revenue trend chart, customer source breakdown, and automated health insights
- **Customers** – Advanced filtering, ownership, status transitions, detail drawer, and activity timeline
- **Team Roles** – Nested role listing, detailed role insights, and permission matrix editor

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.7 | UI Framework |
| TypeScript | 6.0.3 | Type Safety |
| Vite | 8.1.0 | Build Tool |
| Ant Design | 6.5.0 | UI Components |
| React Router | 7.18.0 | Routing |
| Zustand | 5.0.14 | State Management |
| Axios | 1.18.1 | HTTP Client |

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # Shell layout: header, sidebar, breadcrumbs, content
│   └── auth/            # Shared auth UI pieces
├── config/
│   ├── theme.ts         # Theme configuration types and utilities
│   └── theme-presets.ts # Preset theme definitions
├── views/
│   ├── auth/            # Login & register pages (unprotected)
│   ├── dashboard/       # SaaS dashboard page + routes
│   └── customers/       # Customer management module + routes
├── router/              # Auto-imported route definitions & guards
├── store/               # Zustand stores (config + user)
├── utils/               # API client, mock helpers, shared utils
└── App.tsx              # Root layout orchestration
```

---

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm

### Installation

```bash
git clone https://github.com/larry-xue/react-admin-dashboard.git
cd react-admin-dashboard
npm install
npm run dev
```

Visit `http://localhost:5173`.

### Demo Credentials
| Role | Username | Password | Shortcut |
| --- | --- | --- | --- |
| Admin | `admin` | `admin123` | `/auth/login?demo=admin` |
| User | `user` | `user123` | `/auth/login?demo=user` |
| Demo | `demo` | `demo123` | `/auth/login?demo=demo` |

---

## Core Concepts

### Authentication & Authorization
- Login/register flows with Ant Design forms
- `ProtectedRoute` wrapper guarding all non-`/auth/**` routes
- Tokens stored in Zustand + localStorage with auto-injection via Axios interceptors

### Routing
- Vite `import.meta.glob` auto-loads every `*.router.tsx`
- `meta` drives sidebar label/icon/hide/order plus page title
- Nested routes supported out of the box (see `customers` module)

### Theming
- Light / Dark / Compact algorithms controlled via Zustand store
- Persistent theme preferences using localStorage
- **Preset themes**: Blue, Green, Purple, Orange, Teal, Red, Cyan
- **Custom colors**: Support for primary, secondary, success, warning, error, info, background, and text colors
- Runtime theme switching and color customization via store

### Layout & Responsiveness
- Sticky header, collapsible sidebar, breadcrumb trail, and flexible content area
- Breakpoint-aware spacing and auto-collapse on mobile
- Dark-mode-aware charts and cards (Ant Design charts + tokens)

---

## Customization Guide

### Add a Route & Page
1. Create a directory under `src/views/your-page`
2. Build your page component in `index.tsx`
3. Define a `*.router.tsx` file:

```tsx
// src/views/example/example.router.tsx
import { ExampleOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../router'
import ExamplePage from '.'

const exampleRoutes: AdminRouterItem[] = [
  {
    path: 'example',
    element: <ExamplePage />,
    meta: {
      label: 'Example',
      title: 'Example Page',
      key: '/example',
      icon: <ExampleOutlined />,
      order: 3,
    },
  },
]

export default exampleRoutes
```

### Adjust Theme Defaults

#### Option 1: Use Preset Themes
```ts
import useConfigStore from './store/config'

// Switch to a preset theme
const setTheme = useConfigStore(state => state.setTheme)
setTheme('blue')  // or 'green', 'purple', 'orange', 'teal', 'red', 'cyan'
```

#### Option 2: Customize Individual Colors
```ts
import useConfigStore from './store/config'

// Customize a specific color
const setCustomColor = useConfigStore(state => state.setCustomColor)
setCustomColor('primary', '#1890ff')
setCustomColor('success', '#52c41a')
// Available color keys: primary, secondary, success, warning, error, info, background, text
```

#### Option 3: Modify Default Theme in Code
Modify `src/config/theme-presets.ts` to change preset theme colors, or modify `src/store/config.ts` to change the default theme:
```ts
// In src/store/config.ts
const defaultThemeConfig = createDefaultThemeConfig()
defaultThemeConfig.colors.primary = '#your-color'
defaultThemeConfig.colors.secondary = '#your-secondary-color'
```

### API / Mock Settings
`.env` (create if missing):
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK=true             # use built-in mock auth/data
```

---

## NPM Scripts

```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # ESLint check (ts/tsx)
```

---

## Deployment
Output lives in `dist/`. Any static host works:
- [Vercel](https://vercel.com/) – zero-config for Vite
- [Netlify](https://www.netlify.com/) – continuous deployments
- [GitHub Pages](https://pages.github.com/) – static hosting

---

## Contributing
PRs and issues are welcome! Please:
1. Fork the repo & create a feature branch
2. Add tests or docs where it makes sense
3. Run `npm run lint` before submitting

---

## License
MIT © [Yujian Xue](https://larryxue.dev)

Acknowledgements: [Ant Design](https://ant.design/), [Vite](https://vitejs.dev/), [React Router](https://reactrouter.com/), [Zustand](https://github.com/pmndrs/zustand)
