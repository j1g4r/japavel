<script setup lang="ts">
import { RouterView } from 'vue-router'
import './jui/styles/global.css'
</script>

<template>
  <div class="app-root">
    <RouterView />
  </div>
</template>

<style>
.app-root {
  min-height: 100vh;
}
</style>
