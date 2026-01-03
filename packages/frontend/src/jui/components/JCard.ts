import { defineComponent, h, PropType } from 'vue';
import { css, glass, alpha } from '../core/styled';
import { theme } from '../core/theme';

export default defineComponent({
  name: 'JCard',
  props: {
    padding: { type: String as PropType<'none' | 'sm' | 'md' | 'lg' | 'xl'>, default: 'lg' },
    variant: { type: String as PropType<'default' | 'glass' | 'outline' | 'flat'>, default: 'default' },
    hover: { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    
    const baseStyle = css({
      borderRadius: theme.radius.xl,
      transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: props.variant === 'default' ? theme.colors.neutral.white : 'transparent',
      border: props.variant === 'outline' ? `1px solid ${theme.colors.neutral.gray200}` : `1px solid ${theme.surfaces.border}`,
      boxShadow: props.variant === 'flat' ? 'none' : theme.shadow.md,
      cursor: props.hover ? 'pointer' : 'default',
      ...(props.variant === 'glass' ? glass(0.5, 20) : {}),
      ':hover': props.hover ? {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: theme.shadow.lg,
        border: `1px solid ${alpha(theme.colors.brand.primary, 0.2)}`,
      } : {},
    });

    const paddingMap: Record<string, string> = {
      none: '0',
      sm: '0.5rem',
      md: theme.spacing.md,
      lg: theme.spacing.lg,
      xl: theme.spacing.xl,
    };

    const contentStyle = css({
      padding: paddingMap[props.padding] || theme.spacing.lg,
      flex: 1,
    });

    const headerStyle = css({
      padding: `${theme.spacing.md} ${paddingMap[props.padding] || theme.spacing.lg}`,
      borderBottom: `1px solid ${theme.surfaces.border}`,
      fontWeight: '800',
      fontSize: '1.25rem',
      letterSpacing: '-0.02em',
      color: theme.colors.neutral.gray900,
    });

    return () => h('div', { class: baseStyle }, [
      slots.header ? h('div', { class: headerStyle }, slots.header()) : null,
      h('div', { class: contentStyle }, slots.default?.())
    ]);
  }
});
