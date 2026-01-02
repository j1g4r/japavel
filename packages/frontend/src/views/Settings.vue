<script setup lang="ts">
import { ref } from 'vue';
import { JLayout, JCard, JInput, JButton } from '../jui/components';

const settings = ref({
  name: 'John Doe',
  email: 'john@example.com',
  notifications: true,
  theme: 'dark',
});
</script>

<template>
  <JLayout>
    <div class="settings-header">
      <h1>Settings</h1>
      <p>Manage your account and preferences.</p>
    </div>

    <div class="settings-content">
      <div class="settings-section">
        <JCard padding="2rem">
          <template #header>
            <h3 class="section-title">Profile Information</h3>
          </template>
          
          <div class="form-grid">
            <JInput v-model="settings.name" label="Display Name" />
            <JInput v-model="settings.email" label="Email Address" type="email" />
          </div>

          <div class="form-actions">
            <JButton>Save Changes</JButton>
          </div>
        </JCard>
      </div>

      <div class="settings-section">
        <JCard padding="2rem" glass>
          <template #header>
            <h3 class="section-title">System Preferences</h3>
          </template>

          <div class="preference-item">
            <div class="pref-info">
              <h4>Email Notifications</h4>
              <p>Receive updates about project activity.</p>
            </div>
            <input type="checkbox" v-model="settings.notifications" class="j-toggle" />
          </div>

          <div class="preference-item">
            <div class="pref-info">
              <h4>Appearance</h4>
              <p>Customize the look and feel of the dashboard.</p>
            </div>
            <select v-model="settings.theme" class="j-select">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </JCard>
      </div>

      <div class="settings-section">
        <JCard padding="2rem" variant="error" style="border-color: #fecaca; background: #fff1f2;">
          <template #header>
            <h3 class="section-title" style="color: #be123c;">Danger Zone</h3>
          </template>
          <p style="color: #e11d48; margin-bottom: 1.5rem; font-size: 0.9375rem;">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <JButton variant="error">Delete Account</JButton>
        </JCard>
      </div>
    </div>
  </JLayout>
</template>

<style scoped>
.settings-header {
  margin-bottom: 2.5rem;
}

.settings-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.settings-header p {
  color: #6b7280;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.preference-item:last-child {
  border-bottom: none;
}

.pref-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.pref-info p {
  font-size: 0.875rem;
  color: #6b7280;
}

.j-toggle {
  width: 40px;
  height: 20px;
  cursor: pointer;
}

.j-select {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
