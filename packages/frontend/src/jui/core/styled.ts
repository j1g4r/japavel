/**
 * JUI Styling Engine
 * 
 * A lightweight CSS-in-TS solution to replace Tailwind.
 * Handles dynamic style injection, pseudo-classes, and media queries.
 */

// Store injected styles to prevent duplication
const injectedStyles = new Set<string>();
let styleElement: HTMLStyleElement | null = null;

// Ensure style element exists
function getStyleElement() {
  if (typeof document === 'undefined') return null; // SSR safety
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'jui-styles';
    document.head.appendChild(styleElement);
  }
  return styleElement;
}

/**
 * Generate a hash for the style object to create a unique class name
 */
function hashStr(str: string): string {
  let hash = 5381;
  let i = str.length;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return 'jui-' + (hash >>> 0).toString(36);
}

/**
 * Convert camelCase to kebab-case
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Parse a style object into CSS string
 * Separates direct properties from nested selectors (pseudo-classes, media queries)
 */
function parseStyleObject(styles: Record<string, any>, selector: string = ''): string {
  let directProps = '';
  let nestedRules = '';

  for (const [key, value] of Object.entries(styles)) {
    // Handle pseudo-classes (e.g. ':hover', ':active', ':focus')
    if (key.startsWith(':')) {
      const subSelector = `${selector}${key}`;
      nestedRules += parseStyleObject(value, subSelector);
    } 
    // Handle '&' prefix (e.g. '&:hover')
    else if (key.startsWith('&')) {
      const subSelector = key.replace('&', selector);
      nestedRules += parseStyleObject(value, subSelector);
    }
    // Handle @media queries
    else if (key.startsWith('@')) {
      nestedRules += `${key} { ${parseStyleObject(value, selector)} } `;
    }
    // Regular CSS property
    else if (value !== undefined && value !== null) {
      directProps += `${toKebabCase(key)}:${value};`;
    }
  }
  
  // Only create a rule block if there are direct properties
  let css = '';
  if (directProps) {
    css = `${selector} { ${directProps} } `;
  }
  
  return css + nestedRules;
}

/**
 * Alpha color utility - converts HSL to HSLA with proper opacity
 * Usage: alpha(theme.colors.brand.primary, 0.1) -> "hsla(250, 89%, 60%, 0.1)"
 */
export function alpha(color: string, opacity: number): string {
  // Handle hsl() format
  const hslMatch = color.match(/hsl\(([^)]+)\)/);
  if (hslMatch) {
    return `hsla(${hslMatch[1]}, ${opacity})`;
  }
  // Handle hex format
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  // Fallback - return with opacity as rgba wrapper
  return `rgba(128, 128, 128, ${opacity})`;
}

/**
 * Main styled utility
 * Returns a class name that binds the styles
 */
export function css(styles: Record<string, any>): string {
  const styleStr = JSON.stringify(styles);
  const className = hashStr(styleStr);
  
  if (!injectedStyles.has(className)) {
    const el = getStyleElement();
    if (el && el.sheet) {
      const cssRules = parseStyleObject(styles, `.${className}`);
      // Split into individual rules for insertion
      const rules = splitCssRules(cssRules);
      for (const rule of rules) {
        // Skip empty or whitespace-only rules
        if (!rule.trim() || rule.trim().length < 5) continue;
        try {
          el.sheet.insertRule(rule, el.sheet.cssRules.length);
        } catch (e) {
          console.warn('Failed to insert CSS rule:', rule, e);
        }
      }
      injectedStyles.add(className);
    }
  }
  
  return className;
}

/**
 * Split CSS string into individual rules
 * Handles nested braces for @media queries correctly
 */
function splitCssRules(css: string): string[] {
  const rules: string[] = [];
  let currentRule = '';
  let braceCount = 0;
  
  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    currentRule += char;
    if (char === '{') braceCount++;
    if (char === '}') {
      braceCount--;
      // Complete rule when braces are balanced
      if (braceCount === 0 && currentRule.trim()) {
        rules.push(currentRule.trim());
        currentRule = '';
      }
    }
  }
  
  // Filter out any invalid rules (must have selector and braces)
  return rules.filter(r => r.includes('{') && r.includes('}'));
}

/**
 * Glassmorphism utility
 */
export function glass(opacity: number = 0.4, blur: number = 20): Record<string, any> {
  return {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
  };
}

/**
 * Premium Mesh Gradient Generator
 */
export function meshGradient(colors: string[]): string {
  const stops = colors.map((c, i) => {
    const x = Math.floor(Math.sin(i * 45) * 50 + 50);
    const y = Math.floor(Math.cos(i * 45) * 50 + 50);
    return `radial-gradient(at ${x}% ${y}%, ${c} 0px, transparent 50%)`;
  }).join(', ');
  return stops;
}

/**
 * Noise Texture Utility
 */
export function noise(opacity: number = 0.05): string {
  return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"), rgba(255,255,255,${opacity})`;
}

/**
 * Kinetic Animation Utility
 * Returns keyframes class name
 */
export function keyframes(frames: Record<string, Record<string, any>>): string {
  const frameStr = JSON.stringify(frames);
  const name = 'anim-' + hashStr(frameStr);
  
  if (!injectedStyles.has(name)) {
    let css = `@keyframes ${name} {`;
    for (const [key, value] of Object.entries(frames)) {
      css += `${key} {`;
      for (const [prop, val] of Object.entries(value)) {
        css += `${toKebabCase(prop)}:${val};`;
      }
      css += '}';
    }
    css += '}';
    
    const el = getStyleElement();
    if (el && el.sheet) {
      try {
        el.sheet.insertRule(css, el.sheet.cssRules.length);
      } catch (e) {
        console.warn('Failed to insert keyframe rule:', css, e);
      }
      injectedStyles.add(name);
    }
  }
  
  return name;
}
