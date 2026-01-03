<script setup lang="ts">
import { ref } from 'vue'
import {
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CubeIcon,
  BoltIcon,
  HeartIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'

// Import all components
import JButtonPro from '../components/JButtonPro.vue'
import JCardPro from '../components/JCardPro.vue'
import JAvatar from '../components/JAvatar.vue'
import JBadge from '../components/JBadge.vue'
import JInputPro from '../components/JInputPro.vue'
import JModal from '../components/JModal.vue'
import JDropdown from '../components/JDropdown.vue'
import JAlert from '../components/JAlert.vue'
import JTable from '../components/JTable.vue'
import HeroSection from '../components/marketing/HeroSection.vue'
import TestimonialCard from '../components/marketing/TestimonialCard.vue'
import CtaSection from '../components/marketing/CtaSection.vue'
import FeatureGrid from '../components/marketing/FeatureGrid.vue'
import StatsSection from '../components/marketing/StatsSection.vue'

// Demo data
const showModal = ref(false)
const inputValue = ref('')
const inputEmail = ref('')
const inputPassword = ref('')

const dropdownItems = [
  { label: 'Profile', value: 'profile' },
  { label: 'Settings', value: 'settings' },
  { label: 'Billing', value: 'billing' },
  { divider: true, label: '' },
  { label: 'Sign out', value: 'signout', danger: true },
]

const tableColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status', align: 'center' as const },
]

const tableData = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
  { name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
]

const features = [
  { title: 'Lightning Fast', description: 'Built with performance in mind. Every component is optimized for speed.' },
  { title: 'Dark Mode', description: 'Beautiful dark mode support out of the box with seamless transitions.' },
  { title: 'Accessible', description: 'WCAG 2.1 compliant with keyboard navigation and screen reader support.' },
  { title: 'Customizable', description: 'Easily customize every component to match your brand identity.' },
  { title: 'TypeScript', description: 'Full TypeScript support with comprehensive type definitions.' },
  { title: 'Responsive', description: 'Mobile-first design that looks great on any screen size.' },
]

const stats = [
  { label: 'Components', value: '20', suffix: '+' },
  { label: 'Lines of Code', value: '5', suffix: 'K+', trend: 12.5 },
  { label: 'Bundle Size', value: '45', suffix: 'KB', trend: -8.2 },
  { label: 'TypeScript', value: '100', suffix: '%' },
]

const testimonials = [
  {
    quote: 'These components saved us weeks of development time. The attention to detail is incredible.',
    author: 'Sarah Chen',
    role: 'Lead Developer',
    company: 'TechCorp',
    rating: 5,
  },
  {
    quote: 'The best Tailwind component library I have used. The dark mode support is flawless.',
    author: 'Marcus Johnson',
    role: 'Frontend Architect',
    company: 'StartupXYZ',
    rating: 5,
  },
]

// Dark mode toggle
const isDark = ref(false)
const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <div :class="isDark ? 'dark' : ''" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Dark mode toggle -->
    <div class="fixed top-4 right-4 z-50">
      <JButtonPro variant="outline" color="neutral" size="sm" @click="toggleDark">
        {{ isDark ? '☀️ Light' : '🌙 Dark' }}
      </JButtonPro>
    </div>

    <!-- Hero Section -->
    <HeroSection
      layout="centered"
      background="mesh"
      subtitle="Japavel Component Library"
      title="Beautiful Tailwind Components"
      description="A comprehensive collection of premium, accessible, and customizable Vue 3 components built with Tailwind CSS."
    >
      <template #cta>
        <JButtonPro variant="gradient" color="primary" size="lg">
          Get Started
          <template #icon-right>
            <RocketLaunchIcon class="w-5 h-5" />
          </template>
        </JButtonPro>
        <JButtonPro variant="outline" color="neutral" size="lg">
          View on GitHub
        </JButtonPro>
      </template>
    </HeroSection>

    <!-- Stats Section -->
    <StatsSection
      :stats="stats"
      layout="cards"
      title="Built for Production"
      subtitle="Key Metrics"
    />

    <!-- Core Components Section -->
    <section class="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Core Components</h2>

      <!-- Buttons -->
      <JCardPro variant="default" class="mb-8">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Buttons</h3>
        </template>

        <div class="space-y-6">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Solid Variants</p>
            <div class="flex flex-wrap gap-3">
              <JButtonPro variant="solid" color="primary">Primary</JButtonPro>
              <JButtonPro variant="solid" color="secondary">Secondary</JButtonPro>
              <JButtonPro variant="solid" color="accent">Accent</JButtonPro>
              <JButtonPro variant="solid" color="success">Success</JButtonPro>
              <JButtonPro variant="solid" color="warning">Warning</JButtonPro>
              <JButtonPro variant="solid" color="error">Error</JButtonPro>
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Gradient Variants</p>
            <div class="flex flex-wrap gap-3">
              <JButtonPro variant="gradient" color="primary">Primary</JButtonPro>
              <JButtonPro variant="gradient" color="secondary">Secondary</JButtonPro>
              <JButtonPro variant="gradient" color="accent">Accent</JButtonPro>
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Outline & Ghost</p>
            <div class="flex flex-wrap gap-3">
              <JButtonPro variant="outline" color="primary">Outline</JButtonPro>
              <JButtonPro variant="ghost" color="primary">Ghost</JButtonPro>
              <JButtonPro variant="solid" color="primary" :loading="true">Loading</JButtonPro>
              <JButtonPro variant="solid" color="primary" :disabled="true">Disabled</JButtonPro>
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Sizes</p>
            <div class="flex flex-wrap items-center gap-3">
              <JButtonPro variant="solid" color="primary" size="sm">Small</JButtonPro>
              <JButtonPro variant="solid" color="primary" size="md">Medium</JButtonPro>
              <JButtonPro variant="solid" color="primary" size="lg">Large</JButtonPro>
              <JButtonPro variant="solid" color="primary" size="xl">Extra Large</JButtonPro>
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">With Icons</p>
            <div class="flex flex-wrap gap-3">
              <JButtonPro variant="solid" color="primary">
                <template #icon-left><SparklesIcon class="w-4 h-4" /></template>
                Left Icon
              </JButtonPro>
              <JButtonPro variant="gradient" color="secondary">
                Right Icon
                <template #icon-right><HeartIcon class="w-4 h-4" /></template>
              </JButtonPro>
            </div>
          </div>
        </div>
      </JCardPro>

      <!-- Avatars & Badges -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <JCardPro variant="default">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Avatars</h3>
          </template>

          <div class="space-y-6">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Sizes</p>
              <div class="flex items-end gap-4">
                <JAvatar name="John Doe" size="xs" />
                <JAvatar name="Jane Smith" size="sm" />
                <JAvatar name="Bob Wilson" size="md" />
                <JAvatar name="Alice Brown" size="lg" />
                <JAvatar name="Charlie Davis" size="xl" />
              </div>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">With Status</p>
              <div class="flex items-center gap-4">
                <JAvatar name="Online User" size="lg" status="online" />
                <JAvatar name="Away User" size="lg" status="away" />
                <JAvatar name="Busy User" size="lg" status="busy" />
                <JAvatar name="Offline User" size="lg" status="offline" />
              </div>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">With Ring</p>
              <div class="flex items-center gap-4">
                <JAvatar name="Primary Ring" size="lg" ring ringColor="primary" />
                <JAvatar name="Secondary Ring" size="lg" ring ringColor="secondary" />
              </div>
            </div>
          </div>
        </JCardPro>

        <JCardPro variant="default">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Badges</h3>
          </template>

          <div class="space-y-6">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Soft Variants</p>
              <div class="flex flex-wrap gap-2">
                <JBadge variant="soft" color="primary">Primary</JBadge>
                <JBadge variant="soft" color="secondary">Secondary</JBadge>
                <JBadge variant="soft" color="success">Success</JBadge>
                <JBadge variant="soft" color="warning">Warning</JBadge>
                <JBadge variant="soft" color="error">Error</JBadge>
                <JBadge variant="soft" color="info">Info</JBadge>
              </div>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Solid Variants</p>
              <div class="flex flex-wrap gap-2">
                <JBadge variant="solid" color="primary">Primary</JBadge>
                <JBadge variant="solid" color="secondary">Secondary</JBadge>
                <JBadge variant="solid" color="success">Success</JBadge>
              </div>
            </div>

            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Dot & Removable</p>
              <div class="flex flex-wrap gap-2">
                <JBadge variant="dot" color="success">Active</JBadge>
                <JBadge variant="dot" color="error">Offline</JBadge>
                <JBadge variant="soft" color="primary" removable>Removable</JBadge>
              </div>
            </div>
          </div>
        </JCardPro>
      </div>

      <!-- Inputs -->
      <JCardPro variant="default" class="mb-8">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Inputs</h3>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <JInputPro
            v-model="inputValue"
            label="Default Input"
            placeholder="Enter your name"
          />

          <JInputPro
            v-model="inputEmail"
            type="email"
            label="With Icon"
            placeholder="you@example.com"
          >
            <template #icon-left>
              <EnvelopeIcon class="w-5 h-5" />
            </template>
          </JInputPro>

          <JInputPro
            v-model="inputPassword"
            type="password"
            label="Password"
            placeholder="Enter password"
          />

          <JInputPro
            v-model="inputValue"
            label="Floating Label"
            floatingLabel
          />

          <JInputPro
            v-model="inputValue"
            label="Success State"
            state="success"
            helperText="Looks good!"
          />

          <JInputPro
            v-model="inputValue"
            label="Error State"
            state="error"
            helperText="This field is required"
          />
        </div>
      </JCardPro>

      <!-- Cards -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cards</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <JCardPro variant="default" hoverable>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Default Card</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">A simple default card with subtle shadow.</p>
          </JCardPro>

          <JCardPro variant="elevated" hoverable>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Elevated Card</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Card with larger shadow elevation.</p>
          </JCardPro>

          <JCardPro variant="glass" hoverable>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Glass Card</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Glassmorphism style with blur.</p>
          </JCardPro>

          <JCardPro variant="gradient">
            <h4 class="font-semibold mb-2">Gradient Card</h4>
            <p class="text-sm opacity-80">Beautiful gradient background.</p>
          </JCardPro>
        </div>
      </div>

      <!-- Alerts -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alerts</h3>
        <div class="space-y-4">
          <JAlert variant="info" title="Information">
            This is an informational alert message.
          </JAlert>
          <JAlert variant="success" title="Success" dismissible>
            Your changes have been saved successfully.
          </JAlert>
          <JAlert variant="warning" title="Warning">
            Please review the information before proceeding.
          </JAlert>
          <JAlert variant="error" title="Error" dismissible>
            There was an error processing your request.
          </JAlert>
        </div>
      </div>

      <!-- Modal & Dropdown -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <JCardPro variant="default">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Modal</h3>
          </template>
          <JButtonPro variant="solid" color="primary" @click="showModal = true">
            Open Modal
          </JButtonPro>
        </JCardPro>

        <JCardPro variant="default">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Dropdown</h3>
          </template>
          <JDropdown :items="dropdownItems">
            <template #label>Account Menu</template>
          </JDropdown>
        </JCardPro>
      </div>

      <!-- Modal component -->
      <JModal
        v-model:open="showModal"
        title="Example Modal"
        description="This is a demonstration of the JModal component."
        size="md"
      >
        <p class="text-gray-600 dark:text-gray-300">
          Modals are great for focused interactions that require user attention.
          They trap focus and can be dismissed by clicking the overlay or pressing Escape.
        </p>

        <template #footer>
          <JButtonPro variant="ghost" color="neutral" @click="showModal = false">
            Cancel
          </JButtonPro>
          <JButtonPro variant="solid" color="primary" @click="showModal = false">
            Confirm
          </JButtonPro>
        </template>
      </JModal>

      <!-- Table -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Table</h3>
        <JTable :columns="tableColumns" :data="tableData" striped hoverable>
          <template #cell-status="{ value }">
            <JBadge
              :variant="value === 'Active' ? 'soft' : 'soft'"
              :color="value === 'Active' ? 'success' : 'neutral'"
              size="sm"
            >
              {{ value }}
            </JBadge>
          </template>
        </JTable>
      </div>
    </section>

    <!-- Features Section -->
    <FeatureGrid
      :features="features"
      :columns="3"
      cardStyle="filled"
      title="Why Choose Japavel Components"
      subtitle="Features"
    />

    <!-- Testimonials -->
    <section class="py-16 px-6 lg:px-8 bg-gray-100 dark:bg-gray-800/50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">What Developers Say</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TestimonialCard
            v-for="(testimonial, i) in testimonials"
            :key="i"
            :quote="testimonial.quote"
            :author="testimonial.author"
            :role="testimonial.role"
            :company="testimonial.company"
            :rating="testimonial.rating"
            variant="elevated"
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <CtaSection
      variant="gradient"
      layout="centered"
      title="Ready to Build Beautiful UIs?"
      description="Get started with Japavel Components today and accelerate your development workflow."
    >
      <template #actions>
        <JButtonPro variant="solid" color="neutral" size="lg">
          Get Started
          <template #icon-right>
            <RocketLaunchIcon class="w-5 h-5" />
          </template>
        </JButtonPro>
        <JButtonPro variant="outline" color="neutral" size="lg" class="border-white/30 text-white hover:bg-white/10">
          Documentation
        </JButtonPro>
      </template>
    </CtaSection>

    <!-- Footer -->
    <footer class="py-8 px-6 border-t border-gray-200 dark:border-gray-800">
      <p class="text-center text-sm text-gray-500 dark:text-gray-400">
        Japavel Component Library © 2026. Built with Vue 3 + Tailwind CSS.
      </p>
    </footer>
  </div>
</template>
