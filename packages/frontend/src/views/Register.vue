<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { JCard, JInput, JButton } from '../jui/components';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');

const register = () => {
  // Simulated registration
  router.push('/dashboard');
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card-wrapper">
      <JCard glass padding="2.5rem">
        <div class="auth-header">
          <h2 class="j-text-gradient">Create account</h2>
          <p>Join Japavel and start building today.</p>
        </div>

        <form @submit.prevent="register" class="auth-form">
          <JInput
            v-model="name"
            label="Full Name"
            placeholder="John Doe"
          />
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

          <div class="terms">
            By signing up, you agree to our 
            <a href="#">Terms of Service</a>.
          </div>

          <JButton type="submit" size="lg" block variant="secondary">Create Account</JButton>
        </form>

        <p class="auth-footer">
          Already have an account? 
          <router-link to="/login" class="auth-link">Sign in</router-link>
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

.terms {
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: center;
}

.terms a {
  color: #6366f1;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.auth-link {
  color: #ec4899;
  font-weight: 600;
}

button[block] {
  width: 100%;
}
</style>
