<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

/**
 * JDropdown - Dropdown Menu Component
 * 
 * Features:
 * - HeadlessUI Menu integration
 * - Icon support in items
 * - Keyboard navigation
 * - Dividers
 * - Multiple placements
 */

type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

interface DropdownItem {
  label: string
  value?: string
  icon?: string
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

interface Props {
  items: DropdownItem[]
  placement?: Placement
  width?: 'auto' | 'sm' | 'md' | 'lg' | 'trigger'
  buttonVariant?: 'default' | 'ghost' | 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom-end',
  width: 'auto',
  buttonVariant: 'default',
})

const emit = defineEmits<{
  select: [item: DropdownItem]
}>()

const slots = useSlots()
const hasTrigger = computed(() => !!slots.trigger)

const placementClasses: Record<Placement, string> = {
  'bottom-start': 'left-0 origin-top-left',
  'bottom-end': 'right-0 origin-top-right',
  'top-start': 'left-0 bottom-full mb-2 origin-bottom-left',
  'top-end': 'right-0 bottom-full mb-2 origin-bottom-right',
}

const widthClasses: Record<string, string> = {
  auto: 'w-auto min-w-[180px]',
  sm: 'w-40',
  md: 'w-56',
  lg: 'w-72',
  trigger: 'w-full',
}

const buttonVariantClasses: Record<string, string> = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
  ghost: 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
}

const menuClasses = computed(() => [
  'absolute z-50 mt-2 rounded-xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none overflow-hidden',
  placementClasses[props.placement],
  widthClasses[props.width],
])

const handleSelect = (item: DropdownItem) => {
  if (!item.disabled && !item.divider) {
    emit('select', item)
  }
}
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <!-- Trigger -->
    <MenuButton
      v-if="!hasTrigger"
      :class="[
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        buttonVariantClasses[buttonVariant]
      ]"
    >
      <slot name="label">Options</slot>
      <ChevronDownIcon class="w-4 h-4" />
    </MenuButton>

    <!-- Custom trigger -->
    <MenuButton v-else as="template">
      <slot name="trigger" />
    </MenuButton>

    <!-- Menu Items -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <MenuItems :class="menuClasses">
        <div class="py-1">
          <template v-for="(item, index) in items" :key="index">
            <!-- Divider -->
            <div
              v-if="item.divider"
              class="my-1 border-t border-gray-100 dark:border-gray-700"
            />

            <!-- Menu Item -->
            <MenuItem v-else v-slot="{ active }" :disabled="item.disabled">
              <button
                type="button"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors',
                  active && !item.disabled
                    ? 'bg-gray-50 dark:bg-gray-700/50'
                    : '',
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed text-gray-400'
                    : item.danger
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-200',
                ]"
                :disabled="item.disabled"
                @click="handleSelect(item)"
              >
                <!-- Icon slot -->
                <slot :name="`icon-${index}`">
                  <span
                    v-if="item.icon"
                    class="w-5 h-5 flex items-center justify-center"
                  >
                    <!-- Placeholder for dynamic icons -->
                  </span>
                </slot>
                {{ item.label }}
              </button>
            </MenuItem>
          </template>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
