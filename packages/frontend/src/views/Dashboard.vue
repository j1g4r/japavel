<script setup lang="ts">
import { JLayout, JCard, JButton } from '../jui/components';
import { theme } from '../jui/core/theme';

const stats = [
  { label: 'Total Projects', value: '12', color: theme.colors.brand.primary },
  { label: 'Active Users', value: '1,234', color: theme.colors.brand.secondary },
  { label: 'System Health', value: '98%', color: theme.colors.status.success },
  { label: 'Uptime', value: '99.9%', color: theme.colors.status.info },
];
</script>

<template>
  <JLayout>
    <div class="dashboard-header">
      <h1>Dashboard Overview</h1>
      <JButton variant="secondary">Create Project</JButton>
    </div>

    <div class="stats-grid">
      <JCard v-for="stat in stats" :key="stat.label" glass>
        <div class="stat-content">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</span>
        </div>
      </JCard>
    </div>

    <div class="main-content-grid">
      <JCard padding="1.5rem">
        <template #header>
          <h3 class="card-title">Recent Activity</h3>
        </template>
        <div class="activity-list">
          <div v-for="i in 5" :key="i" class="activity-item">
            <div class="activity-dot"></div>
            <div class="activity-info">
              <p class="activity-text">Project <strong>Alpha</strong> was updated by John Doe</p>
              <span class="activity-time">2 hours ago</span>
            </div>
          </div>
        </div>
      </JCard>

      <JCard padding="1.5rem">
        <template #header>
          <h3 class="card-title">System Logs</h3>
        </template>
        <div class="log-viewer">
          <div v-for="i in 8" :key="i" class="log-line">
            <span class="log-time">14:22:0{{ i }}</span>
            <span class="log-level">INFO</span>
            <span class="log-msg">Worker node {{ i }} synchronized successfully.</span>
          </div>
        </div>
      </JCard>
    </div>
  </JLayout>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
}

.main-content-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.activity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #6366f1;
  margin-top: 5px;
}

.activity-info p {
  font-size: 0.9375rem;
  color: #374151;
}

.activity-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.log-viewer {
  background: #111827;
  border-radius: 0.75rem;
  padding: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8125rem;
  height: 300px;
  overflow-y: auto;
}

.log-line {
  margin-bottom: 0.5rem;
  display: flex;
  gap: 1rem;
}

.log-time { color: #6b7280; }
.log-level { color: #10b981; font-weight: 700; }
.log-msg { color: #e5e7eb; }

@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .main-content-grid { grid-template-columns: 1fr; }
}
</style>
