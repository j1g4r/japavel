<script setup lang="ts">
import { onMounted, ref } from 'vue';

defineProps<{
    modelValue: string,
    label: string,
    type?: string,
    id?: string,
    required?: boolean,
    autofocus?: boolean,
    autocomplete?: string
}>();

defineEmits(['update:modelValue']);

const input = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (input.value?.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
    <div class="relative group">
        <input
            ref="input"
            :id="id"
            :type="type || 'text'"
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            class="peer w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary-500 dark:focus:border-primary-500 transition-all duration-300 placeholder-transparent text-gray-900 dark:text-gray-100"
            :placeholder="label"
            :required="required"
            :autofocus="autofocus"
            :autocomplete="autocomplete"
        />
        <label
            class="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-300 
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 
            peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary-500 peer-focus:bg-white dark:peer-focus:bg-gray-900 peer-focus:px-1
            -top-2.5 text-xs bg-white/0 px-1 pointer-events-none"
        >
            {{ label }}
        </label>
    </div>
</template>
