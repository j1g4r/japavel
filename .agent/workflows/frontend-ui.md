---
description: JUI Framework - TypeScript-Only UI Pattern for Japavel Frontend
---

# JUI Framework UI Pattern

When building or modifying frontend views in this project, you MUST follow the **JUI TypeScript-only pattern**. This project does NOT use Vue SFC (`.vue` files) for views—instead, it uses pure TypeScript with Vue's Composition API and `h()` render functions.

## Core Technology Stack

- **Vue 3** with `defineComponent` and `h()` render functions
- **JUI Components** from `../jui/components` (JLayout, JCard, JButton, JInput, JTable, JModal, etc.)
- **CSS-in-JS** via the `css()` function from `../jui/core/styled`
- **Theme System** via `theme` from `../jui/core/theme`

## File Structure

Views are located in: `packages/frontend/src/views/*.ts`

## Required Imports

```typescript
import { defineComponent, h, ref } from 'vue';
import { JLayout, JCard, JButton, JInput } from '../jui/components';
import { css } from '../jui/core/styled';
import { theme } from '../jui/core/theme';
```

## Component Structure Pattern

```typescript
export default defineComponent({
  name: 'ViewName',
  setup() {
    // 1. State (refs, computed)
    const searchQuery = ref('');
    
    // 2. Data (mock or real)
    const items = [...];
    
    // 3. Style definitions using css()
    const pageTitle = css({
      fontSize: '2.5rem',
      fontWeight: '900',
      letterSpacing: '-0.05em',
      color: theme.colors.neutral.gray900,
      marginBottom: '0.5rem',
    });
    
    // 4. Return render function
    return () => {
      return h(JLayout, null, {
        default: () => [
          // Page content using h() function
        ]
      });
    };
  }
});
```

## Style Patterns

### Static Styles
```typescript
const subtitle = css({
  fontSize: '1.125rem',
  color: theme.colors.neutral.gray500,
  fontWeight: '500',
  marginBottom: '2rem',
});
```

### Dynamic Styles (Factory Functions)
```typescript
const statNumber = (color: string) => css({
  fontSize: '2rem',
  fontWeight: '900',
  color: color,
});

// Usage: h('div', { class: statNumber(theme.colors.brand.primary) }, '42')
```

### Pseudo-Selectors
```typescript
const tableRow = css({
  transition: 'background 0.2s ease',
  ':hover': {
    background: 'rgba(255,255,255,0.5)',
  }
});
```

## Layout Patterns

### Page Header
```typescript
h('h1', { class: pageTitle }, 'Page Title'),
h('p', { class: subtitle }, 'Page description text.'),
```

### Header with Actions
```typescript
h('div', { class: headerSection }, [
  h('div', { class: searchBox }, [
    h(JInput, {
      modelValue: searchQuery.value,
      'onUpdate:modelValue': (v: string) => searchQuery.value = v,
      placeholder: 'Search...',
      type: 'text'
    }),
  ]),
  h(JButton, { variant: 'solid' }, { default: () => '+ Add Item' })
]),
```

### Stats Grid
```typescript
h('div', { class: statsRow }, [
  h(JCard, { variant: 'glass', padding: 'lg', class: statCard }, {
    default: () => [
      h('div', { class: statNumber(theme.colors.brand.primary) }, '42'),
      h('div', { class: statLabel }, 'Total Items'),
    ]
  }),
  // More stat cards...
]),
```

### Data Table
```typescript
h(JCard, { padding: 'none' }, {
  default: () => [
    h('div', { class: tableContainer }, [
      h('table', { class: table }, [
        h('thead', null, [
          h('tr', null, [
            h('th', { class: tableHeader }, 'Column 1'),
            h('th', { class: tableHeader }, 'Column 2'),
          ])
        ]),
        h('tbody', null,
          items.map(item => h('tr', { class: tableRow, key: item.id }, [
            h('td', { class: tableCell }, item.value),
          ]))
        )
      ])
    ])
  ]
}),
```

## Badge Pattern (Color-Coded Pills)
```typescript
const badge = (type: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    active: { bg: 'hsla(142, 76%, 36%, 0.1)', text: theme.colors.status.success },
    inactive: { bg: 'hsla(0, 0%, 50%, 0.1)', text: theme.colors.neutral.gray500 },
    pending: { bg: 'hsla(38, 92%, 50%, 0.1)', text: theme.colors.status.warning },
  };
  const c = colors[type] || colors.inactive;
  return css({
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: theme.radius.full,
    fontSize: '0.75rem',
    fontWeight: '700',
    background: c.bg,
    color: c.text,
    textTransform: 'capitalize',
  });
};
```

## Avatar Pattern
```typescript
const avatar = (name: string) => {
  const colors = [theme.colors.brand.primary, theme.colors.brand.secondary, theme.colors.status.info];
  const colorIndex = name.length % colors.length;
  return css({
    width: '40px',
    height: '40px',
    borderRadius: theme.radius.full,
    background: `linear-gradient(135deg, ${colors[colorIndex]}, ${colors[(colorIndex + 1) % colors.length]})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.875rem',
  });
};

// Usage: h('div', { class: avatar(user.name) }, user.name.charAt(0))
```

## Available JUI Components

| Component | Usage |
|-----------|-------|
| `JLayout` | Wrapper with sidebar + navbar |
| `JCard` | Container with variants: `glass`, `solid` |
| `JButton` | Button with variants: `solid`, `ghost`, `outline` |
| `JInput` | Text input field |
| `JSelect` | Dropdown select |
| `JToggle` | Toggle switch |
| `JTable` | Data table |
| `JModal` | Modal dialog |
| `JAlert` | Alert/notification |
| `JBadge` | Badge/pill |
| `JAvatar` | Avatar component |
| `JDropdown` | Dropdown menu |
| `JNavbar` | Navigation bar |

## Theme Tokens

Access via `theme.colors`, `theme.surfaces`, `theme.radius`:

- `theme.colors.brand.primary` — Primary purple
- `theme.colors.brand.secondary` — Secondary color
- `theme.colors.status.success` — Green
- `theme.colors.status.warning` — Orange
- `theme.colors.status.error` — Red
- `theme.colors.status.info` — Blue
- `theme.colors.neutral.gray100` to `gray900`
- `theme.surfaces.border` — Border color
- `theme.surfaces.active` — Active state background
- `theme.radius.md`, `theme.radius.lg`, `theme.radius.full`

## Design Principles

1. **Typography Hierarchy**: Large bold titles (2.5rem, 900 weight), subtle subtitles (1.125rem, gray)
2. **Spacing**: Use consistent margins (`2rem` between sections, `1rem` gaps in grids)
3. **Color Strategy**: HSL-based with soft transparencies for badges
4. **Transitions**: Subtle 0.2s ease transitions on interactive elements
5. **Grid Layouts**: Use CSS Grid for stats rows (`grid-template-columns: repeat(3, 1fr)`)
6. **Responsive**: Use `flexWrap: 'wrap'` and `gap` for responsive layouts

## DO NOT

- ❌ Create `.vue` single-file components for views
- ❌ Use Tailwind classes directly
- ❌ Use JSX syntax (use `h()` function instead)
- ❌ Hardcode colors (use `theme` tokens)
- ❌ Skip the JLayout wrapper for views
