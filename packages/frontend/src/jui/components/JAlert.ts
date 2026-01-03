import { defineComponent, h, computed, ref, Transition, type PropType } from 'vue';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/20/solid';
import { css } from '../core/styled';
import { theme } from '../core/theme';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type AlertStyle = 'solid' | 'soft' | 'outline';

export default defineComponent({
  name: 'JAlert',
  props: {
    variant: {
      type: String as PropType<AlertVariant>,
      default: 'info',
    },
    style: {
      type: String as PropType<AlertStyle>,
      default: 'soft',
    },
    title: String,
    dismissible: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['dismiss'],
  setup(props, { slots, emit }) {
    const isVisible = ref(true);

    const iconComponents = {
      info: InformationCircleIcon,
      success: CheckCircleIcon,
      warning: ExclamationTriangleIcon,
      error: ExclamationCircleIcon,
    };

    const styles = computed(() => {
      const getColors = (variant: AlertVariant) => {
        const map = {
          info: { base: theme.colors.status.info, light: '#e0f2fe', dark: '#0c4a6e', textLight: '#075985', textDark: '#bae6fd' },
          success: { base: theme.colors.status.success, light: '#dcfce7', dark: '#064e3b', textLight: '#065f46', textDark: '#a7f3d0' },
          warning: { base: theme.colors.status.warning, light: '#fef3c7', dark: '#78350f', textLight: '#92400e', textDark: '#fde68a' },
          error: { base: theme.colors.status.error, light: '#fee2e2', dark: '#7f1d1d', textLight: '#991b1b', textDark: '#fecaca' },
        };
        return map[variant];
      };
      
      const colors = getColors(props.variant);
      
      const baseStyle: Record<string, any> = {
        position: 'relative',
        display: 'flex',
        gap: '0.75rem',
        padding: '1rem',
        borderRadius: theme.radius.xl,
        transition: 'all 0.3s ease',
      };

      if (props.style === 'solid') {
        baseStyle.backgroundColor = colors.base;
        baseStyle.color = 'white';
      } else if (props.style === 'soft') {
        baseStyle.backgroundColor = colors.light;
        baseStyle.color = colors.textLight;
        baseStyle.border = `1px solid ${colors.textLight}33`; // 20% opacity
        
        baseStyle['.dark &'] = {
          backgroundColor: colors.dark,
          color: colors.textDark,
          borderColor: `${colors.textDark}33`,
        };
      } else if (props.style === 'outline') {
        baseStyle.border = `2px solid ${colors.base}`;
        baseStyle.color = colors.textLight;
        baseStyle['.dark &'] = {
          color: colors.textDark,
        };
      }
      
      return css(baseStyle);
    });

    const iconClass = computed(() => {
      const base = {
        width: '1.25rem',
        height: '1.25rem',
        flexShrink: 0,
        marginTop: '0.125rem',
      };
      
      if (props.style === 'solid') {
        Object.assign(base, { color: 'rgba(255,255,255,0.8)' });
      } else {
         // inherit or specific color
         // For now inherit main color
      }
      return css(base);
    });

    const dismissBtnClass = css({
      flexShrink: 0,
      padding: '0.25rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
      color: 'inherit',
      opacity: 0.7,
      ':hover': {
        backgroundColor: 'rgba(0,0,0,0.1)',
        opacity: 1,
      },
      '.dark &:hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
      }
    });

    // Transition classes
    const transitionProps = {
      enterActiveClass: css({ transition: 'all 0.3s ease-out' }),
      enterFromClass: css({ opacity: 0, transform: 'scale(0.95) translateY(-0.5rem)' }),
      enterToClass: css({ opacity: 1, transform: 'scale(1) translateY(0)' }),
      leaveActiveClass: css({ transition: 'all 0.2s ease-in' }),
      leaveFromClass: css({ opacity: 1, transform: 'scale(1) translateY(0)' }),
      leaveToClass: css({ opacity: 0, transform: 'scale(0.95) translateY(-0.5rem)' }),
    };

    const handleDismiss = () => {
      isVisible.value = false;
      emit('dismiss');
    };

    return () => {
      return h(Transition, transitionProps, {
        default: () => isVisible.value ? h('div', { class: styles.value, role: 'alert' }, [
          // Icon
          props.icon ? h(iconComponents[props.variant], { class: iconClass.value }) : null,

          // Content
          h('div', { class: css({ flex: 1, minWidth: 0 }) }, [
             props.title ? h('h4', { class: css({ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }) }, props.title) : null,
             h('div', { class: css({ fontSize: '0.875rem', opacity: 0.9 }) }, slots.default ? slots.default() : []),
             slots.actions ? h('div', { class: css({ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }) }, slots.actions()) : null,
          ]),

          // Dismiss
          props.dismissible ? h('button', {
            type: 'button',
            class: dismissBtnClass,
            onClick: handleDismiss
          }, [
            h(XMarkIcon, { class: css({ width: '1rem', height: '1rem' }) })
          ]) : null,

        ]) : null
      });
    };
  }
});
