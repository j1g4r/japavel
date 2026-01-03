<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/20/solid'

/**
 * JInputPro - Premium Input Component
 * 
 * Features:
 * - Left/right icon slots
 * - Validation states (success, error, warning)
 * - Floating label animation
 * - Password toggle
 * - Helper text
 * - Character counter
 */

type State = 'default' | 'success' | 'error' | 'warning'
type Size = 'sm' | 'md' | 'lg'

interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  helperText?: string
  state?: State
  size?: Size
  disabled?: boolean
  required?: boolean
  floatingLabel?: boolean
  maxlength?: number
  showCounter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  state: 'default',
  size: 'md',
  disabled: false,
  required: false,
  floatingLabel: false,
  showCounter: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const slots = useSlots()
const hasLeftIcon = computed(() => !!slots['icon-left'])
const hasRightIcon = computed(() => !!slots['icon-right'])

const isFocused = ref(false)
const showPassword = ref(false)

const isPassword = computed(() => props.type === 'password')
const inputType = computed(() => {
  if (isPassword.value && showPassword.value) return 'text'
  return props.type
})

const hasValue = computed(() => props.modelValue?.length > 0)
const shouldFloatLabel = computed(() => {
  return props.floatingLabel && (isFocused.value || hasValue.value)
})

const sizeClasses: Record<Size, { input: string; label: string }> = {
  sm: {
    input: 'text-sm py-1.5 px-3',
    label: 'text-xs',
  },
  md: {
    input: 'text-sm py-2.5 px-4',
    label: 'text-sm',
  },
  lg: {
    input: 'text-base py-3 px-4',
    label: 'text-base',
  },
}

const stateClasses: Record<State, { ring: string; text: string }> = {
  default: {
    ring: 'ring-gray-300 dark:ring-gray-600 focus:ring-indigo-500',
    text: 'text-gray-500',
  },
  success: {
    ring: 'ring-emerald-500 focus:ring-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    ring: 'ring-red-500 focus:ring-red-500',
    text: 'text-red-600 dark:text-red-400',
  },
  warning: {
    ring: 'ring-amber-500 focus:ring-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
  },
}

const inputClasses = computed(() => {
  const classes = [
    'w-full bg-white dark:bg-gray-800 border-0 ring-1 ring-inset rounded-lg outline-none transition-all duration-200',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'text-gray-900 dark:text-gray-100',
    'focus:ring-2',
    sizeClasses[props.size].input,
    stateClasses[props.state].ring,
  ]
  
  if (hasLeftIcon.value) {
    classes.push('pl-10')
  }
  
  if (hasRightIcon.value || isPassword.value || props.state !== 'default') {
    classes.push('pr-10')
  }
  
  if (props.disabled) {
    classes.push('opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900')
  }
  
  return classes.join(' ')
})

const floatingLabelClasses = computed(() => {
  const base = 'absolute left-4 transition-all duration-200 pointer-events-none bg-white dark:bg-gray-800 px-1'
  
  if (shouldFloatLabel.value) {
    return `${base} -top-2 text-xs ${isFocused.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`
  }
  
  return `${base} top-1/2 -translate-y-1/2 text-gray-400 ${sizeClasses[props.size].label}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const characterCount = computed(() => props.modelValue?.length || 0)
</script>

<template>
  <div class="w-full">
    <!-- Label (non-floating) -->
    <label
      v-if="label && !floatingLabel"
      :class="[
        'block font-medium mb-1.5',
        sizeClasses[size].label,
        disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    
    <!-- Input wrapper -->
    <div class="relative">
      <!-- Left Icon -->
      <div
        v-if="hasLeftIcon"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      >
        <slot name="icon-left" />
      </div>
      
      <!-- Floating Label -->
      <label
        v-if="label && floatingLabel"
        :class="floatingLabelClasses"
      >
        {{ label }}
        <span v-if="required" class="text-red-500 ml-0.5">*</span>
      </label>
      
      <!-- Input Element -->
      <input
        :type="inputType"
        :value="modelValue"
        :placeholder="floatingLabel ? '' : placeholder"
        :disabled="disabled"
        :required="required"
        :maxlength="maxlength"
        :class="inputClasses"
        :aria-invalid="state === 'error'"
        :aria-describedby="helperText ? 'helper-text' : undefined"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <!-- Right side icons -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <!-- Custom right icon -->
        <div v-if="hasRightIcon && !isPassword" class="text-gray-400">
          <slot name="icon-right" />
        </div>
        
        <!-- State icons -->
        <CheckCircleIcon v-if="state === 'success'" class="w-5 h-5 text-emerald-500" />
        <ExclamationCircleIcon v-else-if="state === 'error'" class="w-5 h-5 text-red-500" />
        <ExclamationTriangleIcon v-else-if="state === 'warning'" class="w-5 h-5 text-amber-500" />
        
        <!-- Password toggle -->
        <button
          v-if="isPassword"
          type="button"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
          @click="togglePassword"
        >
          <EyeSlashIcon v-if="showPassword" class="w-5 h-5" />
          <EyeIcon v-else class="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <!-- Helper text and counter row -->
    <div
      v-if="helperText || (showCounter && maxlength)"
      class="flex items-center justify-between mt-1.5 px-1"
    >
      <span
        v-if="helperText"
        id="helper-text"
        :class="['text-xs', stateClasses[state].text]"
      >
        {{ helperText }}
      </span>
      <span v-else></span>
      
      <span
        v-if="showCounter && maxlength"
        :class="[
          'text-xs',
          characterCount > maxlength ? 'text-red-500' : 'text-gray-400'
        ]"
      >
        {{ characterCount }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>
