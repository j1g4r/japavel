import { defineComponent, h, watch, type PropType, Transition } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { css } from '../core/styled';
import { theme } from '../core/theme';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export default defineComponent({
  name: 'JModal',
  props: {
    open: { type: Boolean, required: true },
    size: { type: String as PropType<ModalSize>, default: 'md' },
    title: String,
    description: String,
    closable: { type: Boolean, default: true },
    closeOnOverlay: { type: Boolean, default: true },
    centered: { type: Boolean, default: true },
  },
  emits: ['update:open', 'close'],
  setup(props, { emit, slots }) {
    
    // Styles
    const backdropStyle = css({
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
    });

    const containerStyle = css({
      position: 'fixed',
      inset: 0,
      overflowY: 'auto',
    });

    const wrapperStyle = (centered: boolean) => css({
      display: 'flex',
      minHeight: '100%',
      padding: '1rem',
      justifyContent: 'center',
      alignItems: centered ? 'center' : 'flex-start',
      paddingTop: centered ? '1rem' : '5rem',
    });

    const panelStyle = (size: ModalSize) => css({
      position: 'relative',
      width: '100%',
      backgroundColor: theme.colors.neutral.white,
      borderRadius: theme.radius.xl,
      boxShadow: theme.shadow.xl,
      overflow: 'hidden',
      textAlign: 'left',
      transition: 'all 0.3s ease',
      '.dark &': { backgroundColor: theme.colors.neutral.gray800 },
      ...(size === 'sm' ? { maxWidth: '24rem' } : {}),
      ...(size === 'md' ? { maxWidth: '28rem' } : {}),
      ...(size === 'lg' ? { maxWidth: '32rem' } : {}),
      ...(size === 'xl' ? { maxWidth: '36rem' } : {}),
      ...(size === 'full' ? { maxWidth: '56rem' } : {}),
    });

    const closeBtnStyle = css({
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      padding: '0.5rem',
      borderRadius: theme.radius.lg,
      color: theme.colors.neutral.gray400,
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      ':hover': {
        color: theme.colors.neutral.gray600,
        backgroundColor: theme.colors.neutral.gray100,
      },
      '.dark &': {
        ':hover': {
          color: theme.colors.neutral.gray300,
          backgroundColor: theme.colors.neutral.gray700,
        }
      }
    });

    const headerStyle = css({
      padding: '1.5rem 1.5rem 1rem',
    });

    const titleStyle = css({
      fontSize: '1.125rem',
      fontWeight: '600',
      color: theme.colors.neutral.gray900,
      paddingRight: '2rem',
      '.dark &': { color: theme.colors.neutral.white }
    });

    const descStyle = css({
      marginTop: '0.25rem',
      fontSize: '0.875rem',
      color: theme.colors.neutral.gray500,
      '.dark &': { color: theme.colors.neutral.gray400 }
    });

    const contentStyle = (hasHeader: boolean) => css({
      padding: hasHeader ? '0 1.5rem 1.5rem' : '1.5rem',
    });

    const footerStyle = css({
      padding: '1rem 1.5rem',
      backgroundColor: theme.colors.neutral.gray50,
      borderTop: `1px solid ${theme.colors.neutral.gray100}`,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      '.dark &': {
        backgroundColor: 'rgba(17, 24, 39, 0.5)',
        borderColor: theme.colors.neutral.gray700,
      }
    });

    const close = () => {
      if (props.closable) {
        emit('update:open', false);
        emit('close');
      }
    };

    const handleOverlayClick = () => {
      if (props.closeOnOverlay) close();
    };

    watch(() => props.open, (isOpen) => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = isOpen ? 'hidden' : '';
      }
    });

    return () => {
      return h(TransitionRoot, { appear: true, show: props.open, as: 'template' }, {
        default: () => h(Dialog, { as: 'div', class: css({ position: 'relative', zIndex: 50 }), onClose: handleOverlayClick }, {
          default: () => [
            h(TransitionChild, {
              as: 'template',
              enter: css({ transition: 'opacity 300ms ease-out' }),
              enterFrom: css({ opacity: 0 }),
              enterTo: css({ opacity: 1 }),
              leave: css({ transition: 'opacity 200ms ease-in' }),
              leaveFrom: css({ opacity: 1 }),
              leaveTo: css({ opacity: 0 }),
            }, {
              default: () => h('div', { class: backdropStyle })
            }),

            h('div', { class: containerStyle }, [
              h('div', { class: wrapperStyle(props.centered) }, [
                h(TransitionChild, {
                   as: 'template',
                   enter: css({ transition: 'all 300ms ease-out' }),
                   enterFrom: css({ opacity: 0, transform: 'scale(0.95) translateY(1rem)' }),
                   enterTo: css({ opacity: 1, transform: 'scale(1) translateY(0)' }),
                   leave: css({ transition: 'all 200ms ease-in' }),
                   leaveFrom: css({ opacity: 1, transform: 'scale(1) translateY(0)' }),
                   leaveTo: css({ opacity: 0, transform: 'scale(0.95) translateY(1rem)' }),
                }, {
                   default: () => h(DialogPanel, { class: panelStyle(props.size) }, {
                      default: () => [
                         props.closable ? h('button', { type: 'button', class: closeBtnStyle, onClick: close }, [
                            h(XMarkIcon, { class: css({ width: '1.25rem', height: '1.25rem' }) })
                         ]) : null,

                         (props.title || props.description) ? h('div', { class: headerStyle }, [
                            props.title ? h(DialogTitle, { class: titleStyle }, () => props.title) : null,
                            props.description ? h('p', { class: descStyle }, props.description) : null
                         ]) : null,

                         h('div', { class: contentStyle(!!(props.title || props.description)) }, slots.default?.()),

                         slots.footer ? h('div', { class: footerStyle }, slots.footer()) : null
                      ]
                   })
                })
              ])
            ])
          ]
        })
      });
    };
  }
});
