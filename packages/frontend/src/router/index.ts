import { createRouter, createWebHistory } from "vue-router";
import Welcome from "../views/Welcome";
import Login from "../views/Login";
import Register from "../views/Register";
import Dashboard from "../views/Dashboard";
import Analytics from "../views/Analytics";
import Users from "../views/Users";
import Settings from "../views/Settings";
import ComponentShowcase from "../views/ComponentShowcase";
import { useAuth } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "welcome",
      component: Welcome,
      meta: { requiresAuth: false },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresAuth: false, isGuest: true },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { requiresAuth: false, isGuest: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: "/analytics",
      name: "analytics",
      component: Analytics,
      meta: { requiresAuth: true },
    },
    {
      path: "/users",
      name: "users",
      component: Users,
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
      meta: { requiresAuth: true },
    },
    {
      path: "/showcase",
      name: "showcase",
      component: ComponentShowcase,
      meta: { requiresAuth: false },
    },
  ],
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const auth = useAuth();

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!auth.checkAuth()) {
      // User is not authenticated, redirect to login
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
      return;
    }
  }

  // Check if route is for guest only (login, register)
  if (to.meta.isGuest && auth.checkAuth()) {
    // User is already authenticated, redirect to dashboard
    next({ name: "dashboard" });
    return;
  }

  // Allow navigation
  next();
});

// Prevent browser back button from accessing protected pages after logout
router.afterEach((to, from) => {
  const auth = useAuth();

  // If navigating from a protected route to login/register, clear history
  if (from.meta.requiresAuth && !to.meta.requiresAuth) {
    if (!auth.checkAuth()) {
      // User is not authenticated, prevent going back
      window.history.pushState(null, "", window.location.href);
      window.addEventListener(
        "popstate",
        function onPopState() {
          window.history.pushState(null, "", window.location.href);
        },
        { once: true },
      );
    }
  }
});

export default router;
