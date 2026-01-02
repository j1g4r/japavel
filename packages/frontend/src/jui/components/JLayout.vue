<script setup lang="ts">
import { theme } from '../core/theme';

interface Props {
  withSidebar?: boolean;
}

withDefaults(defineProps<Props>(), {
  withSidebar: true,
});
</script>

<template>
  <div class="j-layout">
    <header class="j-header j-glass">
      <div class="j-header-content">
        <div class="j-logo">
          <span class="j-text-gradient">Japavel</span>
        </div>
        <nav class="j-nav">
          <router-link to="/dashboard" class="j-nav-link">Dashboard</router-link>
          <router-link to="/settings" class="j-nav-link">Settings</router-link>
          <router-link to="/login" class="j-nav-link">Logout</router-link>
        </nav>
      </div>
    </header>

    <div class="j-main-container">
      <aside v-if="withSidebar" class="j-sidebar">
        <!-- Sidebar content could go here -->
        <div class="j-sidebar-item">Overview</div>
        <div class="j-sidebar-item">Analytics</div>
        <div class="j-sidebar-item">Users</div>
      </aside>

      <main class="j-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.j-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.j-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  display: flex;
  align-items: center;
}

.j-header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.j-logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.j-nav {
  display: flex;
  gap: 1.5rem;
}

.j-nav-link {
  font-weight: 500;
  color: v-bind('theme.colors.neutral.gray600');
  font-size: 0.9375rem;
}

.j-nav-link:hover {
  color: v-bind('theme.colors.brand.primary');
}

.j-main-container {
  display: flex;
  flex: 1;
}

.j-sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid v-bind('theme.colors.neutral.gray200');
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.j-sidebar-item {
  padding: 0.75rem 1rem;
  border-radius: v-bind('theme.radius.md');
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: v-bind('theme.colors.neutral.gray600');
}

.j-sidebar-item:hover {
  background: v-bind('theme.colors.neutral.gray50');
  color: v-bind('theme.colors.brand.primary');
}

.j-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
