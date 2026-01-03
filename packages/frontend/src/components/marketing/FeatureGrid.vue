<script setup lang="ts">
import { computed } from 'vue'

/**
 * FeatureGrid - Feature Showcase Component
 * 
 * Features:
 * - Icon-based feature cards
 * - 2/3/4 column responsive grid
 * - Hover animations
 * - Multiple card styles
 */

type Columns = 2 | 3 | 4
type CardStyle = 'simple' | 'bordered' | 'filled' | 'glass'

interface Feature {
  title: string
  description: string
  icon?: string // Heroicon name or slot
}

interface Props {
  features: Feature[]
  columns?: Columns
  cardStyle?: CardStyle
  title?: string
  subtitle?: string
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
  cardStyle: 'simple',
  centered: true,
})

const columnClasses: Record<Columns, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

const cardStyleClasses: Record<CardStyle, string> = {
  simple: 'bg-transparent',
  bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6',
  filled: 'bg-gray-50 dark:bg-gray-800 rounded-2xl p-6',
  glass: 'j-glass rounded-2xl p-6',
}

const gridClasses = computed(() => [
  'grid gap-8',
  columnClasses[props.columns],
])
</script>

<template>
  <section class="py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <!-- Section Header -->
      <div
        v-if="title || subtitle"
        :class="['mb-16', centered ? 'text-center' : '']"
      >
        <p
          v-if="subtitle"
          class="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3"
        >
          {{ subtitle }}
        </p>
        <h2
          v-if="title"
          class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {{ title }}
        </h2>
      </div>

      <!-- Features Grid -->
      <div :class="gridClasses">
        <div
          v-for="(feature, index) in features"
          :key="index"
          :class="[
            'group transition-all duration-300',
            cardStyleClasses[cardStyle],
            cardStyle !== 'simple' && 'j-hover-lift'
          ]"
        >
          <!-- Icon -->
          <div
            class="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300"
          >
            <slot :name="`icon-${index}`">
              <!-- Default icon placeholder -->
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </slot>
          </div>

          <!-- Title -->
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ feature.title }}
          </h3>

          <!-- Description -->
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
