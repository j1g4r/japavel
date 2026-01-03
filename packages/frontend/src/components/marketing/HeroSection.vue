<script setup lang="ts">
import { computed, useSlots } from 'vue'

/**
 * HeroSection - Marketing Hero Component
 * 
 * Features:
 * - Multiple layouts: centered, split, featured
 * - Gradient backgrounds with animated blobs
 * - CTA button slots
 * - Image/illustration support
 * - Dark mode compatible
 */

type Layout = 'centered' | 'split' | 'featured'
type Background = 'mesh' | 'gradient' | 'plain' | 'dark'

interface Props {
  layout?: Layout
  background?: Background
  title?: string
  subtitle?: string
  description?: string
  imagePosition?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'centered',
  background: 'mesh',
  imagePosition: 'right',
})

const slots = useSlots()
const hasImage = computed(() => !!slots.image)
const hasCta = computed(() => !!slots.cta)
const hasBadge = computed(() => !!slots.badge)

const backgroundClasses: Record<Background, string> = {
  mesh: 'j-bg-mesh',
  gradient: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500',
  plain: 'bg-white dark:bg-gray-900',
  dark: 'bg-gray-900',
}

const textColorClasses = computed(() => {
  if (props.background === 'gradient' || props.background === 'dark') {
    return {
      title: 'text-white',
      subtitle: 'text-indigo-200',
      description: 'text-gray-200',
    }
  }
  return {
    title: 'text-gray-900 dark:text-white',
    subtitle: 'text-indigo-600 dark:text-indigo-400',
    description: 'text-gray-600 dark:text-gray-300',
  }
})

const wrapperClasses = computed(() => [
  'relative overflow-hidden min-h-[600px] flex items-center',
  backgroundClasses[props.background],
])

const contentContainerClasses = computed(() => {
  const base = 'relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24'
  
  if (props.layout === 'centered') {
    return `${base} text-center`
  }
  if (props.layout === 'split') {
    return `${base} flex flex-col lg:flex-row items-center gap-12`
  }
  return base
})

const contentClasses = computed(() => {
  if (props.layout === 'split') {
    return 'flex-1 text-center lg:text-left'
  }
  if (props.layout === 'centered') {
    return 'max-w-3xl mx-auto'
  }
  return ''
})

const imageContainerClasses = computed(() => {
  const base = 'flex-1 relative'
  if (props.layout === 'split' && props.imagePosition === 'left') {
    return `${base} order-first lg:order-first`
  }
  return base
})
</script>

<template>
  <section :class="wrapperClasses">
    <!-- Animated background blobs -->
    <div
      v-if="background !== 'plain'"
      class="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <div
        class="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 blur-3xl j-animate-blob"
      />
      <div
        class="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-20 blur-3xl j-animate-blob"
        style="animation-delay: 2s"
      />
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-10 blur-3xl j-animate-blob"
        style="animation-delay: 4s"
      />
    </div>

    <div :class="contentContainerClasses">
      <!-- Content Area -->
      <div :class="contentClasses">
        <!-- Badge -->
        <div v-if="hasBadge" class="mb-6 j-animate-fade-in-down">
          <slot name="badge" />
        </div>

        <!-- Subtitle -->
        <p
          v-if="subtitle"
          :class="[
            'text-sm sm:text-base font-semibold uppercase tracking-wider mb-4 j-animate-fade-in-up',
            textColorClasses.subtitle
          ]"
        >
          {{ subtitle }}
        </p>

        <!-- Title -->
        <h1
          v-if="title"
          :class="[
            'text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 j-animate-fade-in-up',
            textColorClasses.title
          ]"
          style="animation-delay: 100ms"
        >
          {{ title }}
        </h1>

        <!-- Description -->
        <p
          v-if="description"
          :class="[
            'text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl j-animate-fade-in-up',
            layout === 'centered' ? 'mx-auto' : '',
            textColorClasses.description
          ]"
          style="animation-delay: 200ms"
        >
          {{ description }}
        </p>

        <!-- Custom content slot -->
        <slot />

        <!-- CTA Buttons -->
        <div
          v-if="hasCta"
          :class="[
            'flex flex-wrap gap-4 j-animate-fade-in-up',
            layout === 'centered' ? 'justify-center' : ''
          ]"
          style="animation-delay: 300ms"
        >
          <slot name="cta" />
        </div>
      </div>

      <!-- Image Area (for split layout) -->
      <div
        v-if="hasImage && layout !== 'centered'"
        :class="imageContainerClasses"
      >
        <div class="j-animate-fade-in" style="animation-delay: 400ms">
          <slot name="image" />
        </div>
      </div>
    </div>

    <!-- Centered layout image (below content) -->
    <div
      v-if="hasImage && layout === 'centered'"
      class="relative z-10 mt-12 px-6 j-animate-fade-in-up"
      style="animation-delay: 400ms"
    >
      <slot name="image" />
    </div>
  </section>
</template>
