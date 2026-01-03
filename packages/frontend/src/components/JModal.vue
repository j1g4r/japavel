<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

/**
 * JModal - Modal/Dialog Component
 * 
 * Features:
 * - HeadlessUI Dialog integration
 * - Slide/fade animations
 * - Size variants
 * - Close on overlay click
 * - Accessible
 */

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface Props {
  open: boolean
  size?: Size
  title?: string
  description?: string
  closable?: boolean
  closeOnOverlay?: boolean
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  centered: true,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
}>()

const sizeClasses: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
}

const panelClasses = computed(() => [
  'relative w-full transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-2xl transition-all',
  sizeClasses[props.size],
])

const close = () => {
  if (props.closable) {
    emit('update:open', false)
    emit('close')
  }
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

// Prevent body scroll when modal is open
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)
</script>

<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" class="relative z-50" @close="handleOverlayClick">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <!-- Modal container -->
      <div class="fixed inset-0 overflow-y-auto">
        <div
          :class="[
            'flex min-h-full p-4',
            centered ? 'items-center justify-center' : 'items-start justify-center pt-20'
          ]"
        >
          <!-- Panel -->
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95 translate-y-4"
            enter-to="opacity-100 scale-100 translate-y-0"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100 translate-y-0"
            leave-to="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel :class="panelClasses">
              <!-- Close button -->
              <button
                v-if="closable"
                type="button"
                class="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @click="close"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>

              <!-- Header -->
              <div v-if="title || description" class="px-6 pt-6 pb-4">
                <DialogTitle
                  v-if="title"
                  class="text-lg font-semibold text-gray-900 dark:text-white pr-8"
                >
                  {{ title }}
                </DialogTitle>
                <p
                  v-if="description"
                  class="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ description }}
                </p>
              </div>

              <!-- Content -->
              <div :class="title || description ? 'px-6 pb-6' : 'p-6'">
                <slot />
              </div>

              <!-- Footer -->
              <div
                v-if="$slots.footer"
                class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3"
              >
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
