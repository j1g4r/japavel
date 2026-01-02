# Japavel Frontend

This package contains the frontend of the Japavel project, powered by **JUI (Japavel UI)**.

## 🎨 JUI Framework

JUI is a bespoke, high-performance UI framework built entirely in TypeScript and Vue. It is designed to be "AI-native" with explicit styling and kinetic interactions.

### Features
- **Zero Tailwind**: Custom styles built from design tokens in `src/jui/core/theme.ts`.
- **Kinetic Animations**: High-performance transitions for buttons and cards.
- **Glassmorphism**: Built-in glass effects for modern enterprise interfaces.
- **Type-Safe Styling**: Style manager handles variant and size logic with full TS support.

## 📂 Core Pages

The project includes five enterprise-grade pages implemented with JUI:
1. **Welcome**: Vibrant landing page with hero sections.
2. **Login**: Modern authentication interface.
3. **Register**: Onboarding flow for new users.
4. **Dashboard**: Central overview with glassmorphism statistics and system logs.
5. **Settings**: Account and system preference management.

## 🛠 Development

```bash
# Start the development server
pnpm dev

# Build for production
pnpm build
```

The frontend uses **Inertia.js** (or standard Vue/Router setup depending on project config) to bridge the gap with the backend logic.
