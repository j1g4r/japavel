<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'

/**
 * JBadge - Badge/Chip Component
 * 
 * Features:
 * - Pill and dot styles
 * - Multiple color variants
 * - Icon support
 * - Removable with close button
 * - Size variants
 */

type Variant = 'solid' | 'soft' | 'outline' | 'dot'
type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
type Size = 'sm' | 'md' | 'lg'

interface Props {
  variant?: Variant
  color?: Color
  size?: Size
  removable?: boolean
  pill?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'soft',
  color: 'primary',
  size: 'md',
  removable: false,
  pill: true,
})

const emit = defineEmits<{
  remove: []
}>()

const slots = useSlots()
const hasIcon = computed(() => !!slots.icon)

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-2',
}

const dotSizeClasses: Record<Size, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
}

const colorVariants: Record<Variant, Record<Color, string>> = {
  solid: {
    primary: 'bg-indigo-500 text-white',
    secondary: 'bg-pink-500 text-white',
    success: 'bg-emerald-500 text-white',
    warning: 'bg-amber-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-sky-500 text-white',
    neutral: 'bg-gray-600 text-white',
  },
  soft: {
    primary: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    secondary: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    error: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    info: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  outline: {
    primary: 'border border-indigo-500 text-indigo-600 dark:text-indigo-400',
    secondary: 'border border-pink-500 text-pink-600 dark:text-pink-400',
    success: 'border border-emerald-500 text-emerald-600 dark:text-emerald-400',
    warning: 'border border-amber-500 text-amber-600 dark:text-amber-400',
    error: 'border border-red-500 text-red-600 dark:text-red-400',
    info: 'border border-sky-500 text-sky-600 dark:text-sky-400',
    neutral: 'border border-gray-400 text-gray-600 dark:border-gray-500 dark:text-gray-400',
  },
  dot: {
    primary: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    secondary: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    success: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    warning: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    error: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    info: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
}

const dotColorClasses: Record<Color, string> = {
  primary: 'bg-indigo-500',
  secondary: 'bg-pink-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-sky-500',
  neutral: 'bg-gray-500',
}

const badgeClasses = computed(() => {
  return [
    'inline-flex items-center font-medium whitespace-nowrap select-none',
    sizeClasses[props.size],
    colorVariants[props.variant][props.color],
    props.pill ? 'rounded-full' : 'rounded-md',
  ].join(' ')
})

const handleRemove = () => {
  emit('remove')
}
</script>

<template>
  <span :class="badgeClasses">
    <!-- Dot indicator -->
    <span
      v-if="variant === 'dot'"
      :class="['rounded-full flex-shrink-0', dotSizeClasses[size], dotColorClasses[color]]"
    />
    
    <!-- Icon slot -->
    <span v-if="hasIcon" class="flex-shrink-0 -ml-0.5">
      <slot name="icon" />
    </span>
    
    <!-- Content -->
    <slot />
    
    <!-- Remove button -->
    <button
      v-if="removable"
      type="button"
      class="-mr-1 ml-0.5 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-current transition-colors"
      @click="handleRemove"
    >
      <XMarkIcon class="w-3 h-3" />
    </button>
  </span>
</template>
