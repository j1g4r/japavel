<script setup lang="ts">
import { computed } from 'vue';
import { styleManager } from '../core/style-manager';

interface Props {
  glass?: boolean;
  padding?: string;
}

const props = withDefaults(defineProps<Props>(), {
  glass: false,
});

const cardStyle = computed(() => {
  const base = styleManager.getCardStyle(props.glass);
  if (props.padding) {
    base.padding = props.padding;
  }
  return base;
});
</script>

<template>
  <div :style="cardStyle" class="j-card">
    <slot name="header"></slot>
    <div class="j-card-content">
      <slot />
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<style scoped>
.j-card {
  transition: all 0.3s ease;
}

.j-card-content {
  height: 100%;
}
</style>
