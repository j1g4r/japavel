import { defineComponent, h, computed, type PropType } from 'vue';
import { css } from '../core/styled';
import { theme } from '../core/theme';

export default defineComponent({
  name: 'JToggle',
  props: {
    modelValue: { type: Boolean, default: false },
    disabled: Boolean,
    color: { type: String, default: 'primary' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    
    const wrapper = css({
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
      opacity: props.disabled ? 0.5 : 1,
      pointerEvents: props.disabled ? 'none' : 'auto',
    });

    const bg = computed(() => css({
      width: '2.5rem',
      height: '1.25rem',
      backgroundColor: props.modelValue ? theme.colors.brand.primary : theme.colors.neutral.gray300,
      borderRadius: '9999px',
      transition: 'background-color 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      padding: '0 0.125rem',
      '.dark &': {
        backgroundColor: props.modelValue ? theme.colors.brand.primary : theme.colors.neutral.gray600,
      }
    }));

    const dot = computed(() => css({
      width: '1rem',
      height: '1rem',
      backgroundColor: theme.colors.neutral.white,
      borderRadius: '50%',
      boxShadow: theme.shadow.sm,
      transform: props.modelValue ? 'translateX(1.25rem)' : 'translateX(0)',
      transition: 'transform 0.2s ease',
    }));

    const toggle = () => {
      if (!props.disabled) {
        emit('update:modelValue', !props.modelValue);
      }
    };

    return () => {
      return h('div', { class: wrapper, onClick: toggle }, [
        h('div', { class: bg.value }, [
          h('div', { class: dot.value })
        ])
      ]);
    };
  }
});
