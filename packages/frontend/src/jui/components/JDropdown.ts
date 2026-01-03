import { defineComponent, h, type PropType } from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { css } from '../core/styled';
import { theme } from '../core/theme';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';

export interface DropdownItem {
  label: string;
  value?: string;
  icon?: any;
  divider?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default defineComponent({
  name: 'JDropdown',
  props: {
    items: { type: Array as PropType<DropdownItem[]>, default: () => [] },
    label: String,
  },
  setup(props, { slots }) {

    const menuItemsStyle = css({
      position: 'absolute',
      right: 0,
      marginTop: '0.5rem',
      width: '14rem',
      transformOrigin: 'top right',
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.neutral.white,
      boxShadow: theme.shadow.lg,
      border: `1px solid ${theme.colors.neutral.gray100}`,
      outline: 'none',
      zIndex: 50,
      overflow: 'hidden',
      '.dark &': {
        backgroundColor: theme.colors.neutral.gray800,
        borderColor: theme.colors.neutral.gray700,
      }
    });

    const itemStyle = (active: boolean, danger: boolean, disabled: boolean) => css({
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      color: danger ? theme.colors.status.error : theme.colors.neutral.gray700,
      backgroundColor: active ? (danger ? '#fee2e2' : theme.colors.neutral.gray50) : 'transparent',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      border: 'none',
      textAlign: 'left',
      '.dark &': {
         color: danger ? '#fca5a5' : theme.colors.neutral.gray200,
         backgroundColor: active ? (danger ? 'rgba(239,68,68,0.2)' : theme.colors.neutral.gray700) : 'transparent',
      }
    });

    const dividerStyle = css({
      height: '1px',
      margin: '0.25rem 0',
      backgroundColor: theme.colors.neutral.gray100,
      '.dark &': { backgroundColor: theme.colors.neutral.gray700 }
    });

    const triggerStyle = css({
       display: 'inline-flex',
       alignItems: 'center',
       gap: '0.5rem',
       padding: '0.5rem 1rem',
       borderRadius: theme.radius.lg,
       backgroundColor: theme.colors.neutral.white,
       border: `1px solid ${theme.colors.neutral.gray300}`,
       fontSize: '0.875rem',
       fontWeight: '500',
       color: theme.colors.neutral.gray700,
       boxShadow: theme.shadow.sm,
       cursor: 'pointer',
       ':hover': { backgroundColor: theme.colors.neutral.gray50 },
       '.dark &': {
          backgroundColor: theme.colors.neutral.gray800,
          borderColor: theme.colors.neutral.gray600,
          color: theme.colors.neutral.gray200,
          ':hover': { backgroundColor: theme.colors.neutral.gray700 }
       }
    });

    return () => {
      return h(Menu, { as: 'div', class: css({ position: 'relative', display: 'inline-block', textAlign: 'left' }) }, {
        default: () => [
          h('div', [
             h(MenuButton, { class: triggerStyle }, {
                default: () => [
                   slots.label ? slots.label() : (props.label || 'Options'),
                   h(ChevronDownIcon, { class: css({ width: '1.25rem', height: '1.25rem', color: theme.colors.neutral.gray400 }) })
                ]
             })
          ]),

          h(MenuItems, { class: menuItemsStyle }, {
             default: () => [
                h('div', { class: css({ padding: '0.25rem' }) }, 
                   props.items.map((item, idx) => 
                      item.divider ? h('div', { class: dividerStyle, key: `div-${idx}` }) :
                      h(MenuItem, { key: idx, disabled: item.disabled }, {
                         default: ({ active }: { active: boolean }) => h('button', {
                            class: itemStyle(active, !!item.danger, !!item.disabled),
                            onClick: item.onClick
                         }, item.label)
                      })
                   )
                )
             ]
          })
        ]
      });
    };
  }
});
