<script setup lang="ts">
import { computed } from 'vue'

/**
 * JAvatar - Avatar Component
 * 
 * Features:
 * - 5 sizes (xs, sm, md, lg, xl)
 * - Status indicator (online, away, busy, offline)
 * - Image or initials fallback
 * - Grouped avatars support
 * - Ring/border options
 */

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Status = 'online' | 'away' | 'busy' | 'offline' | null

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: Size
  status?: Status
  ring?: boolean
  ringColor?: 'primary' | 'secondary' | 'white'
  squared?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  status: null,
  ring: false,
  ringColor: 'white',
  squared: false,
})

const sizeClasses: Record<Size, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const statusSizeClasses: Record<Size, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
}

const statusColorClasses: Record<Exclude<Status, null>, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-500',
  busy: 'bg-red-500',
  offline: 'bg-gray-400',
}

const ringColorClasses: Record<string, string> = {
  primary: 'ring-indigo-500',
  secondary: 'ring-pink-500',
  white: 'ring-white dark:ring-gray-800',
}

const initials = computed(() => {
  if (!props.name) return '?'
  const parts = props.name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0].substring(0, 2).toUpperCase()
})

// Generate a consistent background color based on name
const initialsGradient = computed(() => {
  if (!props.name) return 'from-gray-400 to-gray-500'
  
  const gradients = [
    'from-indigo-400 to-purple-500',
    'from-pink-400 to-rose-500',
    'from-cyan-400 to-blue-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-violet-400 to-purple-500',
  ]
  
  // Simple hash based on name
  const hash = props.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
})

const avatarClasses = computed(() => {
  const classes = [
    'relative inline-flex items-center justify-center font-semibold text-white select-none overflow-hidden flex-shrink-0',
    sizeClasses[props.size],
    props.squared ? 'rounded-lg' : 'rounded-full',
  ]
  
  if (props.ring) {
    classes.push('ring-2', ringColorClasses[props.ringColor])
  }
  
  if (!props.src) {
    classes.push('bg-gradient-to-br', initialsGradient.value)
  }
  
  return classes.join(' ')
})
</script>

<template>
  <div :class="avatarClasses">
    <!-- Image -->
    <img
      v-if="src"
      :src="src"
      :alt="alt || name || 'Avatar'"
      class="w-full h-full object-cover"
    />
    
    <!-- Initials Fallback -->
    <span v-else>{{ initials }}</span>
    
    <!-- Status Indicator -->
    <span
      v-if="status"
      :class="[
        'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-800',
        statusSizeClasses[size],
        statusColorClasses[status]
      ]"
    />
  </div>
</template>
