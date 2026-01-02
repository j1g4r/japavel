<script setup lang="ts">
import { theme } from '../core/theme';

interface Props {
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="j-input-group">
    <label v-if="label" :for="id" class="j-label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="j-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="j-error">{{ error }}</span>
  </div>
</template>

<style scoped>
.j-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.j-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: v-bind('theme.colors.neutral.gray700');
}

.j-input {
  padding: 0.75rem 1rem;
  border-radius: v-bind('theme.radius.lg');
  border: 1px solid v-bind('theme.colors.neutral.gray200');
  background: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.j-input:focus {
  border-color: v-bind('theme.colors.brand.primary');
  box-shadow: 0 0 0 4px v-bind('theme.colors.brand.primary + "1a"');
}

.j-error {
  font-size: 0.75rem;
  color: v-bind('theme.colors.status.error');
}
</style>
