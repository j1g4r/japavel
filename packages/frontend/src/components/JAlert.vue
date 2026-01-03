<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/20/solid'

/**
 * JAlert - Alert/Notification Component
 * 
 * Features:
 * - Info, success, warning, error variants
 * - Dismissible with animation
 * - Icon and action slots
 * - Solid and soft styles
 */

type Variant = 'info' | 'success' | 'warning' | 'error'
type Style = 'solid' | 'soft' | 'outline'

interface Props {
  variant?: Variant
  style?: Style
  title?: string
  dismissible?: boolean
  icon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  style: 'soft',
  dismissible: false,
  icon: true,
})

const emit = defineEmits<{
  dismiss: []
}>()

const isVisible = ref(true)

const iconComponents = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: ExclamationCircleIcon,
}

const IconComponent = computed(() => iconComponents[props.variant])

const variantStyles: Record<Style, Record<Variant, string>> = {
  solid: {
    info: 'bg-sky-500 text-white',
    success: 'bg-emerald-500 text-white',
    warning: 'bg-amber-500 text-white',
    error: 'bg-red-500 text-white',
  },
  soft: {
    info: 'bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-800',
    success: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800',
    error: 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800',
  },
  outline: {
    info: 'border-2 border-sky-500 text-sky-700 dark:text-sky-300',
    success: 'border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300',
    warning: 'border-2 border-amber-500 text-amber-700 dark:text-amber-300',
    error: 'border-2 border-red-500 text-red-700 dark:text-red-300',
  },
}

const iconColorClasses: Record<Style, Record<Variant, string>> = {
  solid: {
    info: 'text-white/80',
    success: 'text-white/80',
    warning: 'text-white/80',
    error: 'text-white/80',
  },
  soft: {
    info: 'text-sky-500 dark:text-sky-400',
    success: 'text-emerald-500 dark:text-emerald-400',
    warning: 'text-amber-500 dark:text-amber-400',
    error: 'text-red-500 dark:text-red-400',
  },
  outline: {
    info: 'text-sky-500',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
  },
}

const alertClasses = computed(() => [
  'relative flex gap-3 p-4 rounded-xl transition-all duration-300',
  variantStyles[props.style][props.variant],
])

const dismiss = () => {
  isVisible.value = false
  emit('dismiss')
}
</script>

<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95 -translate-y-2"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 -translate-y-2"
  >
    <div v-if="isVisible" :class="alertClasses" role="alert">
      <!-- Icon -->
      <component
        v-if="icon"
        :is="IconComponent"
        :class="['w-5 h-5 flex-shrink-0 mt-0.5', iconColorClasses[style][variant]]"
      />

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4 v-if="title" class="font-semibold text-sm mb-1">
          {{ title }}
        </h4>
        <div class="text-sm opacity-90">
          <slot />
        </div>

        <!-- Actions slot -->
        <div v-if="$slots.actions" class="mt-3 flex gap-2">
          <slot name="actions" />
        </div>
      </div>

      <!-- Dismiss button -->
      <button
        v-if="dismissible"
        type="button"
        class="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none"
        @click="dismiss"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>
  </transition>
</template>
