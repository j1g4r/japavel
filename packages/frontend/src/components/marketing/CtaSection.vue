<script setup lang="ts">
import { computed, useSlots } from 'vue'

/**
 * CtaSection - Call to Action Section
 * 
 * Features:
 * - Multiple layouts: simple, with-image, split
 * - Gradient and solid backgrounds
 * - Button slots
 * - Responsive design
 */

type Variant = 'gradient' | 'solid' | 'dark' | 'light'
type Layout = 'centered' | 'split' | 'banner'

interface Props {
  variant?: Variant
  layout?: Layout
  title: string
  description?: string
  imagePosition?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gradient',
  layout: 'centered',
  imagePosition: 'right',
})

const slots = useSlots()
const hasImage = computed(() => !!slots.image)
const hasActions = computed(() => !!slots.actions)

const variantClasses: Record<Variant, string> = {
  gradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white',
  solid: 'bg-indigo-600 text-white',
  dark: 'bg-gray-900 text-white',
  light: 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white',
}

const textClasses = computed(() => {
  if (props.variant === 'light') {
    return {
      title: 'text-gray-900 dark:text-white',
      description: 'text-gray-600 dark:text-gray-300',
    }
  }
  return {
    title: 'text-white',
    description: 'text-white/80',
  }
})

const sectionClasses = computed(() => [
  'relative overflow-hidden',
  variantClasses[props.variant],
])

const containerClasses = computed(() => {
  const base = 'relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-20'
  
  if (props.layout === 'split') {
    return `${base} flex flex-col lg:flex-row items-center gap-12`
  }
  if (props.layout === 'banner') {
    return `${base} flex flex-col sm:flex-row items-center justify-between gap-6`
  }
  return `${base} text-center`
})

const contentClasses = computed(() => {
  if (props.layout === 'split') {
    return 'flex-1 text-center lg:text-left'
  }
  if (props.layout === 'banner') {
    return 'flex-1'
  }
  return 'max-w-2xl mx-auto'
})
</script>

<template>
  <section :class="sectionClasses">
    <!-- Background decoration -->
    <div
      v-if="variant !== 'light'"
      class="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <div
        class="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"
      />
      <div
        class="absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"
      />
    </div>

    <div :class="containerClasses">
      <!-- Image (split layout, left) -->
      <div
        v-if="hasImage && layout === 'split' && imagePosition === 'left'"
        class="flex-1 order-first lg:order-first"
      >
        <slot name="image" />
      </div>

      <!-- Content -->
      <div :class="contentClasses">
        <h2
          :class="[
            'text-3xl sm:text-4xl font-bold tracking-tight mb-4',
            layout === 'banner' ? 'sm:mb-0' : '',
            textClasses.title
          ]"
        >
          {{ title }}
        </h2>
        
        <p
          v-if="description && layout !== 'banner'"
          :class="['text-lg leading-relaxed mb-8', textClasses.description]"
        >
          {{ description }}
        </p>

        <!-- Actions (for centered layout) -->
        <div
          v-if="hasActions && layout === 'centered'"
          class="flex flex-wrap gap-4 justify-center"
        >
          <slot name="actions" />
        </div>
      </div>

      <!-- Image (split layout, right) -->
      <div
        v-if="hasImage && layout === 'split' && imagePosition === 'right'"
        class="flex-1"
      >
        <slot name="image" />
      </div>

      <!-- Actions (for banner/split layout) -->
      <div
        v-if="hasActions && layout !== 'centered'"
        :class="[
          'flex flex-wrap gap-4',
          layout === 'split' && 'lg:justify-start justify-center w-full lg:w-auto',
          layout === 'banner' && 'flex-shrink-0'
        ]"
      >
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
