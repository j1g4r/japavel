# Japavel CSS & UI/UX Guidelines

This document outlines the standards for front-end development in the Japavel framework, focusing on **RichUI**, **Smooth Transitions**, and **Vibrant Themes**.

## 1. Core Principles

### Rich & Vibrant
- **Curated Palettes**: Avoid default browser colors. Use extended Tailwind palettes with high saturation for accents and subtle depth for backgrounds.
- **Visual Depth**: Use `ring` and `shadow` utilities to create layers.
- **Glassmorphism**: Utilize backdrop-blur and semi-transparent backgrounds for modern overlays.

### Kinetic & Smooth
- **Always Animated**: Interactive elements should have transitions (`transition-all duration-300`).
- **Micro-animations**: Subtle scales or bounces on hover/click to provide tactile feedback.
- **Optimistic UI**: Transitions should make the interface feel instant and alive.

---

## 2. Color Palette Standards

| Category | Recommended Tailwind Classes | Usage |
| --- | --- | --- |
| **Primary** | `bg-indigo-600` / `text-indigo-600` | Main actions, branding. |
| **Success** | `bg-emerald-500` / `text-emerald-500` | Affirmative actions, positive metrics. |
| **Highlight** | `bg-violet-500` / `text-violet-500` | Feature highlights, premium elements. |
| **Glass** | `bg-white/70 backdrop-blur-md` | Modals, floating headers. |

---

## 3. Standard Component Recipes

### Rich Card
```html
<div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 transition-all hover:shadow-2xl hover:-translate-y-1">
  <!-- Content -->
</div>
```

### Kinetic Button
```html
<button class="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]">
  Get Started
</button>
```

### Vibrant Input
```html
<input class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
```

---

## 4. Animation Utilities

We recommend using the following custom animation patterns in `tailwind.config.js`:

| Utility | Effect |
| --- | --- |
| `animate-fade-in` | Subtle entrance for content. |
| `animate-slide-up` | Bottom-to-top entrance for lists/cards. |
| `animate-pulse-slow` | Soft indicator for background processes. |

---

## 5. Accessibility Mandate
While richness is a priority, all interfaces must maintain **WCAG 2.1 AA** compliance:
- Minimum contrast ratio of 4.5:1 for text.
- Focus states must be highly visible (`ring-2 ring-offset-2`).
- Respect `prefers-reduced-motion` settings.
