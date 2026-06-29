# React Admin Dashboard

React admin template with React 19, TypeScript 6, Vite 8, Ant Design v6, React Router v7, and Zustand v5.

## Tech Stack

- React 19.2.7
- TypeScript 6.0.3
- Vite 8.1.0
- Ant Design 6.5.0
- React Router 7.18.0
- Zustand 5.0.14

## Project Structure

```
src/
├── components/layout/    # Layout components (Sidebar, Header, Content, Breadcrumb)
├── router/              # Router configuration with auto-import
├── store/               # Zustand state management
└── views/               # Page components and route definitions
```

## Key Features

### Auto Route Importing

Routes are automatically loaded from `views/**/*.router.tsx` files using Vite's `import.meta.glob`.

Route definition example:
```typescript
const routes: AdminRouterItem[] = [{
  path: 'demo',
  element: <DemoPage />,
  meta: { label: "Demo", title: "Demo", key: "/demo", icon: <Icon /> },
  children: [...]
}]
export default routes
```

### Layout Components

Built-in layout system with:
- Sidebar (auto-generated from routes)
- Header
- Content area
- Breadcrumb (auto-generated from routes)
- Footer

### Theme Switching

Theme management via Zustand store (`src/store/config.ts`):
- Light/Dark/Compact modes
- Primary color customization
- Algorithm-based theme switching

### State Management

Zustand stores in `src/store/`:
- `config.ts` - Theme configuration

## Development

- Node.js 20.19+ or 22.12+ required
- Routes: Create `*.router.tsx` files in `views/` directories
- Layout: Components in `src/components/layout/`
- State: Add Zustand stores in `src/store/`
