<script setup lang="ts">
import { computed } from 'vue'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/vue/20/solid'

/**
 * StatsSection - Statistics Display Component
 * 
 * Features:
 * - Large number display
 * - Trend indicators (up/down)
 * - Multiple layouts
 * - Animated count-up ready (class hooks)
 */

type Layout = 'grid' | 'inline' | 'cards'

interface Stat {
  label: string
  value: string | number
  prefix?: string // e.g., '$'
  suffix?: string // e.g., '%', 'K', 'M'
  trend?: number // Percentage change, positive or negative
  description?: string
}

interface Props {
  stats: Stat[]
  layout?: Layout
  title?: string
  subtitle?: string
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'grid',
  dark: false,
})

const containerClasses = computed(() => [
  'py-16 sm:py-24',
  props.dark ? 'bg-gray-900' : 'bg-white dark:bg-gray-900',
])

const layoutClasses = computed(() => {
  const base = 'mx-auto max-w-7xl px-6 lg:px-8'
  
  if (props.layout === 'inline') {
    return `${base} flex flex-wrap justify-center gap-x-16 gap-y-8`
  }
  if (props.layout === 'cards') {
    return `${base} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`
  }
  return `${base} grid grid-cols-2 lg:grid-cols-4 gap-8`
})

const statItemClasses = computed(() => {
  if (props.layout === 'cards') {
    return 'bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center j-hover-lift'
  }
  if (props.layout === 'inline') {
    return 'text-center'
  }
  return 'text-center'
})

const textClasses = computed(() => ({
  value: props.dark ? 'text-white' : 'text-gray-900 dark:text-white',
  label: props.dark ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400',
  description: props.dark ? 'text-gray-500' : 'text-gray-500 dark:text-gray-500',
}))

const formatTrend = (trend: number) => {
  const formatted = Math.abs(trend).toFixed(1)
  return trend > 0 ? `+${formatted}%` : `-${formatted}%`
}
</script>

<template>
  <section :class="containerClasses">
    <!-- Section Header -->
    <div
      v-if="title || subtitle"
      class="text-center mb-16 mx-auto max-w-7xl px-6 lg:px-8"
    >
      <p
        v-if="subtitle"
        class="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3"
      >
        {{ subtitle }}
      </p>
      <h2
        :class="[
          'text-3xl sm:text-4xl font-bold tracking-tight',
          dark ? 'text-white' : 'text-gray-900 dark:text-white'
        ]"
      >
        {{ title }}
      </h2>
    </div>

    <!-- Stats Grid -->
    <div :class="layoutClasses">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        :class="statItemClasses"
      >
        <!-- Value -->
        <div class="flex items-baseline justify-center gap-1">
          <span
            v-if="stat.prefix"
            :class="['text-2xl font-medium', textClasses.label]"
          >
            {{ stat.prefix }}
          </span>
          <span
            :class="[
              'text-4xl sm:text-5xl font-bold tabular-nums j-stat-value',
              textClasses.value
            ]"
            :data-value="stat.value"
          >
            {{ stat.value }}
          </span>
          <span
            v-if="stat.suffix"
            :class="['text-2xl font-medium', textClasses.label]"
          >
            {{ stat.suffix }}
          </span>
        </div>

        <!-- Trend indicator -->
        <div
          v-if="stat.trend !== undefined"
          :class="[
            'mt-2 inline-flex items-center gap-1 text-sm font-medium rounded-full px-2 py-0.5',
            stat.trend >= 0
              ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950'
              : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950'
          ]"
        >
          <ArrowTrendingUpIcon v-if="stat.trend >= 0" class="w-4 h-4" />
          <ArrowTrendingDownIcon v-else class="w-4 h-4" />
          {{ formatTrend(stat.trend) }}
        </div>

        <!-- Label -->
        <p :class="['mt-3 text-sm font-medium', textClasses.label]">
          {{ stat.label }}
        </p>

        <!-- Description -->
        <p
          v-if="stat.description"
          :class="['mt-1 text-xs', textClasses.description]"
        >
          {{ stat.description }}
        </p>
      </div>
    </div>
  </section>
</template>
