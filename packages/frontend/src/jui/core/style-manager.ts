/**
 * JUI Style Manager
 * 
 * Utility to generate CSS styles and class names from design tokens.
 */
import { theme } from './theme';

export type Variant = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error';
export type Size = 'sm' | 'md' | 'lg' | 'xl';

export const styleManager = {
  /**
   * Get hex color from token path
   */
  color(path: string): string {
    const parts = path.split('.');
    let current: any = theme.colors;
    for (const part of parts) {
      current = current[part];
    }
    return current;
  },

  /**
   * Simple tailwind-like utility class generator for JUI
   * (Actually returns inline styles or pre-defined class mappings)
   */
  getButtonStyle(variant: Variant = 'primary', size: Size = 'md') {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '500',
      borderRadius: theme.radius.lg,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      fontFamily: 'inherit',
    };

    const sizes = {
      sm: { padding: '0.4rem 0.8rem', fontSize: '0.875rem' },
      md: { padding: '0.6rem 1.2rem', fontSize: '1rem' },
      lg: { padding: '0.8rem 1.6rem', fontSize: '1.125rem' },
      xl: { padding: '1rem 2rem', fontSize: '1.25rem' },
    };

    const variants = {
      primary: {
        background: `linear-gradient(135deg, ${theme.colors.brand.primary}, ${theme.colors.brand.primaryDark})`,
        color: theme.colors.neutral.white,
        boxShadow: `0 4px 15px -1px rgba(99, 102, 241, 0.3)`,
      },
      secondary: {
        background: `linear-gradient(135deg, ${theme.colors.brand.secondary}, ${theme.colors.brand.secondaryDark})`,
        color: theme.colors.neutral.white,
        boxShadow: `0 4px 15px -1px rgba(236, 72, 153, 0.3)`,
      },
      neutral: {
        background: theme.colors.neutral.gray100,
        color: theme.colors.neutral.gray900,
        border: `1px solid ${theme.colors.neutral.gray200}`,
      },
      success: {
        background: theme.colors.status.success,
        color: theme.colors.neutral.white,
      },
      warning: {
        background: theme.colors.status.warning,
        color: theme.colors.neutral.white,
      },
      error: {
        background: theme.colors.status.error,
        color: theme.colors.neutral.white,
      }
    };

    return { ...base, ...sizes[size], ...variants[variant] };
  },

  getCardStyle(glass: boolean = false) {
    if (glass) {
      return {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: theme.shadow.lg,
        borderRadius: theme.radius.xl,
        padding: theme.spacing.xl,
      };
    }
    return {
      background: theme.colors.neutral.white,
      border: `1px solid ${theme.colors.neutral.gray100}`,
      boxShadow: theme.shadow.md,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.xl,
    };
  }
};
