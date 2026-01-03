import { defineComponent, h, computed, type PropType } from 'vue';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import { css } from '../core/styled';
import { theme } from '../core/theme';

export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'dot';
export type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

export default defineComponent({
  name: 'JBadge',
  props: {
    variant: {
      type: String as PropType<BadgeVariant>,
      default: 'soft',
    },
    color: {
      type: String as PropType<BadgeColor>,
      default: 'primary',
    },
    size: {
      type: String as PropType<BadgeSize>,
      default: 'md',
    },
    removable: {
      type: Boolean,
      default: false,
    },
    pill: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['remove'],
  setup(props, { slots, emit }) {
    // Style Mappings
    const getColors = (color: BadgeColor) => {
      const map: Record<BadgeColor, { base: string; dark?: string; light?: string; contrast: string }> = {
        primary: { base: theme.colors.brand.primary, light: '#e0e7ff', dark: '#312e81', contrast: '#ffffff' }, // Indigo-like
        secondary: { base: theme.colors.brand.secondary, light: '#fce7f3', dark: '#831843', contrast: '#ffffff' },
        success: { base: theme.colors.status.success, light: '#dcfce7', dark: '#064e3b', contrast: '#ffffff' },
        warning: { base: theme.colors.status.warning, light: '#fef3c7', dark: '#78350f', contrast: '#ffffff' },
        error: { base: theme.colors.status.error, light: '#fee2e2', dark: '#7f1d1d', contrast: '#ffffff' },
        info: { base: theme.colors.status.info, light: '#e0f2fe', dark: '#0c4a6e', contrast: '#ffffff' },
        neutral: { base: theme.colors.neutral.gray500, light: theme.colors.neutral.gray100, dark: theme.colors.neutral.gray800, contrast: '#ffffff' },
      };
      return map[color];
    };

    const styles = computed(() => {
      const colors = getColors(props.color);
      
      const baseStyle: Record<string, any> = {
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        borderRadius: props.pill ? theme.radius.full : theme.radius.md,
        transition: 'all 0.2s ease',
      };

      // Size Styles
      const sizeStyles: Record<BadgeSize, Record<string, any>> = {
        sm: { fontSize: '0.75rem', padding: '0.125rem 0.5rem', gap: '0.25rem' },
        md: { fontSize: '0.75rem', padding: '0.25rem 0.625rem', gap: '0.375rem' },
        lg: { fontSize: '0.875rem', padding: '0.375rem 0.75rem', gap: '0.5rem' },
      };
      Object.assign(baseStyle, sizeStyles[props.size]);

      // Variant Styles
      if (props.variant === 'solid') {
        baseStyle.backgroundColor = colors.base;
        baseStyle.color = colors.contrast;
      } else if (props.variant === 'soft') {
        baseStyle.backgroundColor = colors.light;
        baseStyle.color = colors.base; // Darker text for soft background? 
        // Logic for dark mode adaptation
        baseStyle['.dark &'] = {
          backgroundColor: colors.dark,
          color: '#e0e7ff', // approximate light text
        };
      } else if (props.variant === 'outline') {
        baseStyle.border = `1px solid ${colors.base}`;
        baseStyle.color = colors.base;
      } else if (props.variant === 'dot') {
        baseStyle.backgroundColor = 'transparent';
        baseStyle.color = theme.colors.neutral.gray700;
        baseStyle.border = `1px solid ${theme.colors.neutral.gray200}`;
      }

      return css(baseStyle);
    });

    const dotClass = computed(() => {
      const colors = getColors(props.color);
      return css({
        width: props.size === 'sm' ? '0.375rem' : props.size === 'md' ? '0.5rem' : '0.625rem',
        height: props.size === 'sm' ? '0.375rem' : props.size === 'md' ? '0.5rem' : '0.625rem',
        borderRadius: '50%',
        backgroundColor: colors.base,
      });
    });

    const removeBtnClass = css({
      marginLeft: '0.125rem',
      padding: '0.125rem',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      background: 'transparent',
      color: 'inherit',
      ':hover': {
        backgroundColor: 'rgba(0,0,0,0.1)',
      }
    });

    return () => {
      return h('span', { class: styles.value }, [
        // Dot
        props.variant === 'dot' ? h('span', { class: dotClass.value }) : null,
        
        // Icon Slot
        slots.icon ? h('span', { class: css({ display: 'flex' }) }, slots.icon()) : null,
        
        // Content
        slots.default ? slots.default() : null,
        
        // Remove Button
        props.removable ? h('button', { 
          type: 'button',
          class: removeBtnClass,
          onClick: (e: Event) => {
            e.stopPropagation();
            emit('remove');
          }
        }, [
          h(XMarkIcon, { class: css({ width: '1rem', height: '1rem' }) })
        ]) : null
      ]);
    };
  }
});
