<script setup lang="ts">
import { computed, useSlots } from 'vue'

/**
 * JButtonPro - Premium Button Component
 * 
 * Features:
 * - 4 variants: solid, outline, ghost, gradient
 * - 4 sizes: sm, md, lg, xl
 * - 6 color schemes: primary, secondary, accent, success, warning, error
 * - Icon support (left/right)
 * - Loading state with spinner
 * - Disabled state
 * - Kinetic hover effects
 */

type Variant = 'solid' | 'outline' | 'ghost' | 'gradient'
type Size = 'sm' | 'md' | 'lg' | 'xl'
type Color = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral'

interface Props {
  variant?: Variant
  size?: Size
  color?: Color
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  iconOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  size: 'md',
  color: 'primary',
  disabled: false,
  loading: false,
  type: 'button',
  fullWidth: false,
  iconOnly: false,
})

const slots = useSlots()
const hasLeftIcon = computed(() => !!slots['icon-left'])
const hasRightIcon = computed(() => !!slots['icon-right'])

// Base classes
const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none'

// Size classes
const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
  md: 'text-sm px-4 py-2 rounded-lg gap-2',
  lg: 'text-base px-5 py-2.5 rounded-lg gap-2',
  xl: 'text-lg px-6 py-3 rounded-xl gap-2.5',
}

const iconOnlySizeClasses: Record<Size, string> = {
  sm: 'p-1.5 rounded-md',
  md: 'p-2 rounded-lg',
  lg: 'p-2.5 rounded-lg',
  xl: 'p-3 rounded-xl',
}

// Color variant combinations
const variantClasses = computed(() => {
  const color = props.color
  
  const variants: Record<Variant, Record<Color, string>> = {
    solid: {
      primary: 'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40',
      secondary: 'bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 focus-visible:ring-pink-500 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40',
      accent: 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 focus-visible:ring-sky-500 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40',
      success: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 focus-visible:ring-emerald-500 shadow-lg shadow-emerald-500/25',
      warning: 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 focus-visible:ring-amber-500 shadow-lg shadow-amber-500/25',
      error: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-500 shadow-lg shadow-red-500/25',
      neutral: 'bg-gray-700 text-white hover:bg-gray-800 active:bg-gray-900 focus-visible:ring-gray-500 shadow-lg shadow-gray-500/25',
    },
    outline: {
      primary: 'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus-visible:ring-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950',
      secondary: 'border-2 border-pink-500 text-pink-600 hover:bg-pink-50 active:bg-pink-100 focus-visible:ring-pink-500 dark:text-pink-400 dark:hover:bg-pink-950',
      accent: 'border-2 border-sky-500 text-sky-600 hover:bg-sky-50 active:bg-sky-100 focus-visible:ring-sky-500 dark:text-sky-400 dark:hover:bg-sky-950',
      success: 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 focus-visible:ring-emerald-500',
      warning: 'border-2 border-amber-500 text-amber-600 hover:bg-amber-50 active:bg-amber-100 focus-visible:ring-amber-500',
      error: 'border-2 border-red-500 text-red-600 hover:bg-red-50 active:bg-red-100 focus-visible:ring-red-500',
      neutral: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-500 dark:border-gray-600 dark:text-gray-300',
    },
    ghost: {
      primary: 'text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus-visible:ring-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950',
      secondary: 'text-pink-600 hover:bg-pink-50 active:bg-pink-100 focus-visible:ring-pink-500 dark:text-pink-400 dark:hover:bg-pink-950',
      accent: 'text-sky-600 hover:bg-sky-50 active:bg-sky-100 focus-visible:ring-sky-500 dark:text-sky-400 dark:hover:bg-sky-950',
      success: 'text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 focus-visible:ring-emerald-500',
      warning: 'text-amber-600 hover:bg-amber-50 active:bg-amber-100 focus-visible:ring-amber-500',
      error: 'text-red-600 hover:bg-red-50 active:bg-red-100 focus-visible:ring-red-500',
      neutral: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
    },
    gradient: {
      primary: 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 focus-visible:ring-indigo-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50',
      secondary: 'bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 focus-visible:ring-pink-500 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50',
      accent: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 text-white hover:from-cyan-600 hover:via-sky-600 hover:to-blue-600 focus-visible:ring-sky-500 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50',
      success: 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 focus-visible:ring-emerald-500 shadow-lg shadow-emerald-500/30',
      warning: 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 focus-visible:ring-amber-500 shadow-lg shadow-amber-500/30',
      error: 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white hover:from-red-600 hover:via-rose-600 hover:to-pink-600 focus-visible:ring-red-500 shadow-lg shadow-red-500/30',
      neutral: 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 focus-visible:ring-gray-500 shadow-lg shadow-gray-500/30',
    },
  }
  
  return variants[props.variant][color]
})

// Final computed classes
const buttonClasses = computed(() => {
  const classes = [baseClasses]
  
  // Size
  if (props.iconOnly) {
    classes.push(iconOnlySizeClasses[props.size])
  } else {
    classes.push(sizeClasses[props.size])
  }
  
  // Variant + Color
  classes.push(variantClasses.value)
  
  // Full width
  if (props.fullWidth) {
    classes.push('w-full')
  }
  
  // Disabled/Loading state
  if (props.disabled || props.loading) {
    classes.push('opacity-50 cursor-not-allowed pointer-events-none')
  } else {
    // Kinetic hover effect
    classes.push('hover:scale-[1.02] active:scale-[0.98]')
  }
  
  return classes.join(' ')
})
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    
    <!-- Left Icon Slot -->
    <span v-if="hasLeftIcon && !loading" class="flex-shrink-0">
      <slot name="icon-left" />
    </span>
    
    <!-- Content -->
    <span v-if="!iconOnly">
      <slot />
    </span>
    <slot v-else />
    
    <!-- Right Icon Slot -->
    <span v-if="hasRightIcon" class="flex-shrink-0">
      <slot name="icon-right" />
    </span>
  </button>
</template>
