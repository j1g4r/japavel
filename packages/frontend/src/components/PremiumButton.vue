<script setup lang="ts">
defineProps<{
    type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
    <button
        :type="type || 'button'"
        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 border border-transparent rounded-full font-semibold text-xs text-white uppercase tracking-widest hover:from-primary-500 hover:to-primary-400 focus:bg-primary-700 active:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition ease-in-out duration-300 shadow-lg hover:shadow-primary-500/50 transform hover:-translate-y-0.5"
    >
        <slot />
    </button>
</template>
