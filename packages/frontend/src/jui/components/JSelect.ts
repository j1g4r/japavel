import { defineComponent, h, computed, type PropType } from 'vue';
import { css } from '../core/styled';
import { theme } from '../core/theme';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';

export interface SelectOption {
  label: string;
  value: string | number;
}

export default defineComponent({
  name: 'JSelect',
  props: {
    modelValue: { type: [String, Number], default: '' },
    options: { type: Array as PropType<SelectOption[]>, default: () => [] },
    label: String,
    disabled: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    
    const container = css({
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
      width: '100%',
    });

    const labelStyle = css({
      fontSize: '0.875rem',
      fontWeight: '500',
      color: theme.colors.neutral.gray700,
      '.dark &': { color: theme.colors.neutral.gray300 }
    });

    const selectWrapper = css({
      position: 'relative',
      width: '100%',
    });

    const selectStyle = css({
      appearance: 'none',
      width: '100%',
      backgroundColor: theme.colors.neutral.white,
      border: `1px solid ${theme.colors.neutral.gray300}`,
      borderRadius: theme.radius.lg,
      padding: '0.625rem 2.5rem 0.625rem 1rem', // Space for icon
      fontSize: '0.875rem',
      color: theme.colors.neutral.gray900,
      outline: 'none',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '.dark &': {
        backgroundColor: theme.colors.neutral.gray800,
        borderColor: theme.colors.neutral.gray600,
        color: theme.colors.neutral.gray100,
      },
      ':focus': {
        borderColor: theme.colors.brand.primary,
        boxShadow: `0 0 0 2px ${theme.colors.brand.primary}33`, // 20% opacity
      },
      ':disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
        backgroundColor: theme.colors.neutral.gray50,
      }
    });

    const iconStyle = css({
      position: 'absolute',
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1.25rem',
      height: '1.25rem',
      color: theme.colors.neutral.gray500,
      pointerEvents: 'none',
    });

    return () => {
      return h('div', { class: container }, [
        props.label ? h('label', { class: labelStyle }, props.label) : null,
        h('div', { class: selectWrapper }, [
          h('select', { 
            class: selectStyle, 
            value: props.modelValue, 
            disabled: props.disabled,
            onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLSelectElement).value)
          }, props.options.map(opt => h('option', { value: opt.value }, opt.label))),
          h(ChevronDownIcon, { class: iconStyle })
        ])
      ]);
    };
  }
});
