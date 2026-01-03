<script setup lang="ts">
import { computed, useSlots } from 'vue'

/**
 * JCardPro - Versatile Card Component
 * 
 * Features:
 * - Multiple variants: default, elevated, outline, glass, gradient
 * - Customizable padding
 * - Header/Footer slots
 * - Hover effects
 * - Stats card mode
 */

type Variant = 'default' | 'elevated' | 'outline' | 'glass' | 'gradient'
type Padding = 'none' | 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  variant?: Variant
  padding?: Padding
  hoverable?: boolean
  clickable?: boolean
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'lg',
  hoverable: false,
  clickable: false,
  rounded: 'xl',
})

const slots = useSlots()
const hasHeader = computed(() => !!slots.header)
const hasFooter = computed(() => !!slots.footer)
const hasImage = computed(() => !!slots.image)

const paddingClasses: Record<Padding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
}

const roundedClasses: Record<string, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-3xl',
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm',
  elevated: 'bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50',
  outline: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
  glass: 'j-glass shadow-lg',
  gradient: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl',
}

const cardClasses = computed(() => {
  const classes = [
    'relative overflow-hidden transition-all duration-300',
    roundedClasses[props.rounded],
    variantClasses[props.variant],
  ]
  
  // Padding on content area (not when there's an image header)
  if (!hasImage.value) {
    classes.push(paddingClasses[props.padding])
  }
  
  // Hover effects
  if (props.hoverable || props.clickable) {
    classes.push('hover:-translate-y-1 hover:shadow-xl')
    if (props.variant === 'default' || props.variant === 'elevated') {
      classes.push('hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20')
    }
  }
  
  if (props.clickable) {
    classes.push('cursor-pointer active:scale-[0.98]')
  }
  
  return classes.join(' ')
})

const contentClasses = computed(() => {
  if (hasImage.value) {
    return paddingClasses[props.padding]
  }
  return ''
})
</script>

<template>
  <div :class="cardClasses">
    <!-- Image Slot -->
    <div v-if="hasImage" class="overflow-hidden">
      <slot name="image" />
    </div>
    
    <!-- Header Slot -->
    <div 
      v-if="hasHeader" 
      class="border-b border-gray-100 dark:border-gray-700"
      :class="hasImage ? paddingClasses[padding] + ' pb-4' : 'pb-4'"
    >
      <slot name="header" />
    </div>
    
    <!-- Main Content -->
    <div :class="contentClasses">
      <slot />
    </div>
    
    <!-- Footer Slot -->
    <div 
      v-if="hasFooter" 
      class="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
