<script setup lang="ts">
import GlassCard from '../components/GlassCard.vue';
</script>

<template>
    <div
        class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-primary-900 via-secondary-900 to-black text-white selection:bg-primary-500 selection:text-white"
    >
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        
        <div class="z-10 w-full sm:max-w-md mt-6 px-6 py-4">
            <GlassCard class="px-6 py-6 ring-1 ring-white/10">
                <slot />
            </GlassCard>
        </div>
    </div>
</template>
