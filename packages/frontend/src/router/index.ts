import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome'
import Login from '../views/Login'
import Register from '../views/Register'
import Dashboard from '../views/Dashboard'
import Analytics from '../views/Analytics'
import Users from '../views/Users'
import Settings from '../views/Settings'
import ComponentShowcase from '../views/ComponentShowcase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: Analytics
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/showcase',
      name: 'showcase',
      component: ComponentShowcase
    }
  ]
})

export default router
