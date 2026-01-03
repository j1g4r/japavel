import { defineComponent, h, PropType } from 'vue';
import { css, glass, alpha } from '../core/styled';
import { theme } from '../core/theme';

export default defineComponent({
  name: 'JButton',
  props: {
    variant: { type: String as PropType<'solid' | 'outline' | 'glass' | 'ghost'>, default: 'solid' },
    color: { type: String as PropType<'primary' | 'secondary' | 'neutral' | 'error'>, default: 'primary' },
    size: { type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>, default: 'md' },
    block: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    
    const colorValue = props.color === 'primary' 
      ? theme.colors.brand.primary 
      : props.color === 'secondary' 
        ? theme.colors.brand.secondary 
        : props.color === 'error' 
          ? theme.colors.status.error 
          : theme.colors.neutral.gray600;

    const darkColor = props.color === 'primary' 
      ? theme.colors.brand.primaryDark 
      : props.color === 'secondary' 
        ? theme.colors.brand.secondaryDark 
        : theme.colors.neutral.gray800;

    const baseStyle = css({
      display: props.block ? 'flex' : 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      fontWeight: '700',
      width: props.block ? '100%' : 'auto',
      borderRadius: theme.radius.lg,
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      fontFamily: 'inherit',
      fontSize: props.size === 'sm' ? '0.875rem' : props.size === 'lg' ? '1.125rem' : props.size === 'xl' ? '1.25rem' : '1rem',
      padding: props.size === 'sm' ? '0.5rem 1rem' : props.size === 'lg' ? '1rem 2rem' : props.size === 'xl' ? '1.5rem 3rem' : '0.8rem 1.75rem',
      position: 'relative',
      overflow: 'hidden',
      
      // Haptic-like interaction
      ':active': { transform: 'scale(0.95)' },
      ':hover': { transform: 'translateY(-2px)' },

      // Solid Variant
      ...(props.variant === 'solid' ? {
        background: `linear-gradient(135deg, ${colorValue}, ${darkColor})`,
        color: '#fff',
        boxShadow: theme.shadow.md,
        ':hover': {
          boxShadow: theme.shadow.lg,
          filter: 'brightness(1.1)',
        }
      } : {}),

      // Glass Variant
      ...(props.variant === 'glass' ? {
        ...glass(0.2, 12),
        color: colorValue,
        border: `1px solid ${alpha(colorValue, 0.2)}`,
        ':hover': {
           background: alpha(colorValue, 0.07),
           border: `1px solid ${alpha(colorValue, 0.4)}`,
        }
      } : {}),

      // Outline Variant
      ...(props.variant === 'outline' ? {
        background: 'transparent',
        border: `2px solid ${colorValue}`,
        color: colorValue,
        ':hover': {
          background: colorValue,
          color: '#fff',
        }
      } : {}),

      // Ghost Variant
      ...(props.variant === 'ghost' ? {
        background: 'transparent',
        color: colorValue,
        ':hover': {
          background: alpha(colorValue, 0.07),
        }
      } : {}),
    });

    const shineEffect = css({
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
      pointerEvents: 'none',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      ':hover': { opacity: 1 }
    });

    return () => h('button', { class: baseStyle }, [
      h('div', { class: shineEffect }),
      slots.default?.()
    ]);
  }
});
