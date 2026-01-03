<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

/**
 * JNavbar - Navigation Bar Component
 * 
 * Features:
 * - Sticky/fixed positioning
 * - Mobile hamburger menu
 * - User dropdown slot
 * - Dark/light mode toggle slot
 * - Glass/solid variants
 */

type Variant = 'solid' | 'glass' | 'transparent'

interface NavItem {
  label: string
  href?: string
  active?: boolean
}

interface Props {
  variant?: Variant
  sticky?: boolean
  items?: NavItem[]
  logo?: string
  logoAlt?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  sticky: true,
  items: () => [],
})

const emit = defineEmits<{
  navigate: [item: NavItem]
}>()

const mobileMenuOpen = ref(false)

const variantClasses: Record<Variant, string> = {
  solid: 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800',
  glass: 'j-glass border-b border-white/10',
  transparent: 'bg-transparent',
}

const navClasses = computed(() => [
  'w-full z-40 transition-all duration-300',
  props.sticky ? 'sticky top-0' : 'relative',
  variantClasses[props.variant],
])

const toggleMobile = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleNavigate = (item: NavItem) => {
  emit('navigate', item)
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav :class="navClasses">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <slot name="logo">
            <a href="/" class="flex items-center gap-2">
              <img
                v-if="logo"
                :src="logo"
                :alt="logoAlt || 'Logo'"
                class="h-8 w-auto"
              />
              <span
                v-else
                class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                Japavel
              </span>
            </a>
          </slot>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex md:items-center md:gap-1">
          <template v-for="(item, index) in items" :key="index">
            <a
              :href="item.href || '#'"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                item.active
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              ]"
              @click.prevent="handleNavigate(item)"
            >
              {{ item.label }}
            </a>
          </template>

          <!-- Custom nav items slot -->
          <slot name="nav-items" />
        </div>

        <!-- Right side actions -->
        <div class="flex items-center gap-4">
          <!-- Desktop actions -->
          <div class="hidden md:flex md:items-center md:gap-3">
            <slot name="actions" />
          </div>

          <!-- User dropdown slot -->
          <slot name="user" />

          <!-- Mobile menu button -->
          <button
            type="button"
            class="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
            @click="toggleMobile"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
            <XMarkIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-gray-100 dark:border-gray-800"
      >
        <div class="px-4 py-4 space-y-1">
          <template v-for="(item, index) in items" :key="index">
            <a
              :href="item.href || '#'"
              :class="[
                'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                item.active
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              ]"
              @click.prevent="handleNavigate(item)"
            >
              {{ item.label }}
            </a>
          </template>

          <!-- Mobile actions -->
          <div class="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <slot name="mobile-actions" />
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>
