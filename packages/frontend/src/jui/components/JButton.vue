<script setup lang="ts">
import { computed } from 'vue';
import { styleManager, type Variant, type Size } from '../core/style-manager';

interface Props {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  kinetic?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
  kinetic: true,
});

const buttonStyle = computed(() => styleManager.getButtonStyle(props.variant, props.size));
const classes = computed(() => ({
  'j-button': true,
  'j-kinetic-hover': props.kinetic && !props.disabled,
  'j-disabled': props.disabled,
}));
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :style="buttonStyle"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.j-button {
  user-select: none;
}

.j-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
