import { defineComponent, h, ref, PropType } from 'vue';
import { css, glass } from '../core/styled';
import { theme } from '../core/theme';

export default defineComponent({
  name: 'JInput',
  props: {
    modelValue: { type: String, default: '' },
    label: String,
    placeholder: String,
    type: { type: String, default: 'text' },
    error: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isFocused = ref(false);

    const containerStyle = css({
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
      width: '100%',
    });

    const labelStyle = css({
      fontSize: '0.875rem',
      fontWeight: '800',
      color: theme.colors.neutral.gray600,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      marginLeft: '0.25rem',
    });

    const inputWrapper = css({
      position: 'relative',
      borderRadius: theme.radius.lg,
      padding: '2px', // Space for gradient border
      background: isFocused.value 
        ? `linear-gradient(135deg, ${theme.colors.brand.primary}, ${theme.colors.brand.secondary})`
        : theme.colors.neutral.gray200,
      transition: 'all 0.4s ease',
    });

    const inputBase = css({
      width: '100%',
      padding: '1rem 1.25rem',
      borderRadius: 'calc(' + theme.radius.lg + ' - 2px)',
      border: 'none',
      background: theme.colors.neutral.white,
      fontSize: '1rem',
      color: theme.colors.neutral.gray900,
      transition: 'all 0.3s ease',
      outline: 'none',
      '::placeholder': { color: theme.colors.neutral.gray400 },
      ...(isFocused.value ? {
         boxShadow: theme.shadow.md,
      } : {}),
    });

    const errorStyle = css({
      fontSize: '0.8125rem',
      color: theme.colors.status.error,
      fontWeight: '600',
      marginLeft: '0.25rem',
    });

    return () => h('div', { class: containerStyle }, [
      props.label ? h('label', { class: labelStyle }, props.label) : null,
      h('div', { class: css({
        position: 'relative',
        borderRadius: theme.radius.lg,
        padding: '2px',
        background: isFocused.value 
          ? `linear-gradient(135deg, ${theme.colors.brand.primary}, ${theme.colors.brand.secondary})`
          : theme.colors.neutral.gray200,
        transition: 'all 0.4s ease',
        boxShadow: isFocused.value ? theme.shadow.md : 'none',
      }) }, [
        h('input', {
          class: inputBase,
          value: props.modelValue,
          type: props.type,
          placeholder: props.placeholder,
          onInput: (e: any) => emit('update:modelValue', e.target.value),
          onFocus: () => isFocused.value = true,
          onBlur: () => isFocused.value = false,
        })
      ]),
      props.error ? h('span', { class: errorStyle }, props.error) : null,
    ]);
  }
});
