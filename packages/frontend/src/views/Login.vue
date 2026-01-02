<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { JCard, JInput, JButton } from '../jui/components';

const router = useRouter();
const email = ref('');
const password = ref('');

const login = () => {
  // Simulated login
  router.push('/dashboard');
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card-wrapper">
      <JCard glass padding="2.5rem">
        <div class="auth-header">
          <h2 class="j-text-gradient">Welcome back</h2>
          <p>Please enter your details to sign in.</p>
        </div>

        <form @submit.prevent="login" class="auth-form">
          <JInput
            v-model="email"
            label="Email Address"
            placeholder="name@company.com"
            type="email"
          />
          <JInput
            v-model="password"
            label="Password"
            placeholder="••••••••"
            type="password"
          />

          <div class="auth-options">
            <label class="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          <JButton type="submit" size="lg" block>Sign In</JButton>
        </form>

        <p class="auth-footer">
          Don't have an account? 
          <router-link to="/register" class="auth-link">Create one</router-link>
        </p>
      </JCard>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}

.auth-card-wrapper {
  width: 100%;
  max-width: 440px;
  padding: 1.5rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h2 {
  font-size: 1.875rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #6b7280;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.auth-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  cursor: pointer;
}

.forgot-link {
  color: #6366f1;
  font-weight: 500;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.auth-link {
  color: #6366f1;
  font-weight: 600;
}

button[block] {
  width: 100%;
}
</style>
