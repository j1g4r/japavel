<script setup lang="ts">
import { computed } from 'vue'
import { StarIcon } from '@heroicons/vue/20/solid'

/**
 * TestimonialCard - Customer Testimonial Component
 * 
 * Features:
 * - Avatar with quote marks
 * - Star rating display
 * - Company logo slot
 * - Dark/light variants
 * - Multiple layouts
 */

type Variant = 'default' | 'elevated' | 'glass' | 'dark' | 'gradient'
type Layout = 'stacked' | 'inline'

interface Props {
  variant?: Variant
  layout?: Layout
  quote: string
  author: string
  role?: string
  company?: string
  avatarUrl?: string
  rating?: number // 0-5
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  layout: 'stacked',
  rating: 0,
  featured: false,
})

const variantClasses: Record<Variant, string> = {
  default: 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700',
  elevated: 'bg-white dark:bg-gray-800 shadow-xl',
  glass: 'j-glass',
  dark: 'bg-gray-900 text-white',
  gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white',
}

const textColorClasses = computed(() => {
  if (props.variant === 'dark' || props.variant === 'gradient') {
    return {
      quote: 'text-white',
      author: 'text-white',
      role: 'text-gray-300',
      stars: 'text-amber-400',
    }
  }
  return {
    quote: 'text-gray-700 dark:text-gray-200',
    author: 'text-gray-900 dark:text-white',
    role: 'text-gray-500 dark:text-gray-400',
    stars: 'text-amber-500',
  }
})

const cardClasses = computed(() => [
  'relative p-6 sm:p-8 rounded-2xl transition-all duration-300',
  variantClasses[props.variant],
  props.featured ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-900' : '',
  'j-hover-lift',
])

const initials = computed(() => {
  const parts = props.author.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0].substring(0, 2).toUpperCase()
})
</script>

<template>
  <div :class="cardClasses">
    <!-- Quote mark -->
    <svg
      class="absolute top-4 left-4 w-8 h-8 opacity-10"
      fill="currentColor"
      viewBox="0 0 32 32"
    >
      <path
        d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"
      />
    </svg>

    <!-- Stars Rating -->
    <div v-if="rating > 0" class="flex gap-0.5 mb-4">
      <StarIcon
        v-for="i in 5"
        :key="i"
        :class="[
          'w-5 h-5',
          i <= rating ? textColorClasses.stars : 'text-gray-300 dark:text-gray-600'
        ]"
      />
    </div>

    <!-- Quote -->
    <blockquote :class="['text-lg leading-relaxed mb-6', textColorClasses.quote]">
      "{{ quote }}"
    </blockquote>

    <!-- Author Info -->
    <div :class="['flex items-center gap-4', layout === 'inline' ? 'flex-row' : 'flex-col sm:flex-row']">
      <!-- Avatar -->
      <div
        class="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold"
      >
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="author"
          class="w-full h-full object-cover"
        />
        <span v-else>{{ initials }}</span>
      </div>

      <!-- Name & Role -->
      <div :class="layout === 'stacked' ? 'text-center sm:text-left' : ''">
        <p :class="['font-semibold', textColorClasses.author]">
          {{ author }}
        </p>
        <p :class="['text-sm', textColorClasses.role]">
          <span v-if="role">{{ role }}</span>
          <span v-if="role && company"> at </span>
          <span v-if="company" class="font-medium">{{ company }}</span>
        </p>
      </div>

      <!-- Company Logo Slot -->
      <div v-if="$slots.logo" class="ml-auto">
        <slot name="logo" />
      </div>
    </div>

    <!-- Featured badge -->
    <div
      v-if="featured"
      class="absolute -top-3 -right-3 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
    >
      Featured
    </div>
  </div>
</template>
