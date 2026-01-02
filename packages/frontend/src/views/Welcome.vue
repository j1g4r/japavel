<script setup lang="ts">
import { JButton } from '../jui/components';
</script>

<template>
  <div class="welcome-container">
    <div class="hero">
      <h1 class="hero-title">
        Welcome to <span class="j-text-gradient">Japavel</span>
      </h1>
      <p class="hero-subtitle">
        The next-generation enterprise framework built for speed, 
        scalability, and breathtaking user experiences.
      </p>
      <div class="hero-actions">
        <JButton size="xl" @click="$router.push('/register')">Get Started</JButton>
        <JButton size="xl" variant="neutral" @click="$router.push('/login')">Sign In</JButton>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card j-glass">
        <h3>Full-Stack Mastery</h3>
        <p>Seamless integration between backend and frontend.</p>
      </div>
      <div class="feature-card j-glass">
        <h3>Enterprise Grade</h3>
        <p>Secure, scalable, and built for high-performance.</p>
      </div>
      <div class="feature-card j-glass">
        <h3>Kinetic UI</h3>
        <p>Smooth transitions and high-performance animations.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(circle at top right, #eef2ff 0%, #ffffff 100%);
}

.hero {
  text-align: center;
  max-width: 800px;
  margin-bottom: 4rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.04em;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #4b5563;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
}

.feature-card {
  padding: 2rem;
  border-radius: 1.5rem;
  text-align: left;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
}

.feature-card p {
  color: #6b7280;
}

@media (max-width: 768px) {
  .hero-title { font-size: 2.5rem; }
  .features-grid { grid-template-columns: 1fr; }
}
</style>
