# Authentication Quick Reference Guide

## Setup

### Environment Variables
```bash
# Create .env file in frontend directory
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

## Basic Usage

### Import Auth Store
```typescript
import { useAuth } from '@/stores/auth';
const auth = useAuth();
```

### Login
```typescript
try {
  await auth.login('user@example.com', 'password123', true); // true = remember me
  // Redirects to dashboard automatically
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Logout
```typescript
await auth.logout(); // Clears session and redirects to login
```

### Check Authentication Status
```typescript
if (auth.checkAuth()) {
  // User is authenticated
  console.log('User:', auth.user.value);
} else {
  // User is not authenticated
}
```

### Get Auth Headers
```typescript
const headers = {
  'Content-Type': 'application/json',
  ...auth.getAuthHeader()
};
```

## API Requests

### Using API Client (Recommended)
```typescript
import { apiClient } from '@/utils/api';

// GET
const data = await apiClient.get('/endpoint');

// POST
const result = await apiClient.post('/endpoint', { key: 'value' });

// PUT
await apiClient.put('/endpoint', { key: 'value' });

// PATCH
await apiClient.patch('/endpoint', { key: 'value' });

// DELETE
await apiClient.delete('/endpoint');
```

### Manual Fetch
```typescript
const response = await fetch('/api/endpoint', {
  headers: {
    'Content-Type': 'application/json',
    ...auth.getAuthHeader()
  }
});
```

## Route Protection

### Protect a Route
```typescript
// In router config
{
  path: '/dashboard',
  component: Dashboard,
  meta: { requiresAuth: true } // Routes to /login if not authenticated
}
```

### Guest Only Routes
```typescript
{
  path: '/login',
  component: Login,
  meta: { isGuest: true } // Routes to /dashboard if already authenticated
}
```

### Check in Component
```typescript
import { useAuth } from '@/stores/auth';
import { onMounted } from 'vue';

onMounted(() => {
  if (!auth.checkAuth()) {
    router.push('/login');
  }
});
```

## Session Behavior

| Feature | Remember Me = false | Remember Me = true |
|----------|-------------------|-------------------|
| Session Duration | 24 hours | 12 hours |
| Inactivity Timeout | 30 minutes | None |
| Storage | sessionStorage | localStorage |
| Auto-Refresh | No | Yes (when < 1hr remaining) |

## Reactive State

```typescript
// Access reactive state
const isAuthenticated = computed(() => auth.isAuthenticated.value);
const user = computed(() => auth.user.value);
const rememberMe = computed(() => auth.rememberMe.value);
const expiresIn = computed(() => auth.expiresIn.value);
const lastActivity = computed(() => auth.lastActivity.value);
```

## Common Patterns

### Authenticated Component
```typescript
import { useAuth } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const auth = useAuth();
    const router = useRouter();

    if (!auth.checkAuth()) {
      router.push('/login');
      return { loading: true };
    }

    return { user: auth.user.value, loading: false };
  }
});
```

### Logout Button
```typescript
<button @click="handleLogout">Logout</button>

const handleLogout = async () => {
  await auth.logout();
};
```

### Display User Info
```typescript
<template>
  <div v-if="user">
    <p>Welcome, {{ user.name || user.email }}</p>
  </div>
</template>

<script setup>
import { useAuth } from '@/stores/auth';

const auth = useAuth();
const user = computed(() => auth.user.value);
</script>
```

### Conditional Rendering
```typescript
<template>
  <div v-if="auth.checkAuth()">
    <AuthenticatedContent />
  </div>
  <div v-else>
    <LoginRequiredMessage />
  </div>
</template>

<script setup>
import { useAuth } from '@/stores/auth';
const auth = useAuth();
</script>
```

## Error Handling

### Login Error
```typescript
try {
  await auth.login(email, password, rememberMe);
} catch (error) {
  errorMessage.value = error.message || 'Login failed. Please try again.';
}
```

### API Error
```typescript
try {
  const data = await apiClient.get('/endpoint');
} catch (error) {
  if (error.status === 401) {
    // Session expired, auth logout handles auto-redirect
  } else if (error.status === 403) {
    // Forbidden
  } else {
    console.error('API error:', error.message);
  }
}
```

## Storage Keys

If you need to manually inspect storage:

```javascript
// localStorage/sessionStorage keys
auth_token           // Access token
auth_refresh_token   // Refresh token
auth_user           // User data (JSON)
auth_remember_me    // Remember me flag
auth_last_activity  // Last activity timestamp
auth_expires_at     // Session expiration timestamp
```

## Debugging

### Check Current Session
```javascript
console.log('Is authenticated:', auth.checkAuth());
console.log('User:', auth.user.value);
console.log('Expires in:', auth.expiresIn.value / 1000 / 60, 'minutes');
console.log('Remember me:', auth.rememberMe.value);
```

### View Storage
```javascript
// Check sessionStorage (regular session)
console.log('Session:', sessionStorage.getItem('auth_token'));

// Check localStorage (remember me session)
console.log('Local:', localStorage.getItem('auth_token'));
```

### Clear Session Manually
```javascript
// This will also trigger logout
localStorage.clear();
sessionStorage.clear();
```

## Activity Tracking

The system automatically tracks:
- Mouse movements
- Keyboard input
- Scroll events
- Touch events
- Clicks

Activity updates every 30 minutes check. No manual intervention needed.

## Browser Testing

### Test Regular Session
1. Login without "remember me"
2. Wait 30 minutes without activity → Auto-logout
3. Close and reopen browser → Session lost

### Test Remember Me Session
1. Login with "remember me"
2. Close and reopen browser → Still logged in
3. Wait 12 hours → Session expired
4. Wait inactivity → No auto-logout

### Test Logout + Back Button
1. Login
2. Navigate to dashboard
3. Logout
4. Try browser back → Should stay on login page

## Quick Commands

```bash
# Check if user is logged in
auth.checkAuth()

# Get current user
auth.user.value

# Logout
await auth.logout()

# Get auth headers
auth.getAuthHeader()

// Check session time remaining
const minutesRemaining = auth.expiresIn.value / 1000 / 60;
console.log(`Session expires in ${minutesRemaining} minutes`);
```

## Support

- **Full Documentation:** `/packages/frontend/AUTHENTICATION.md`
- **Implementation Details:** `/packages/frontend/IMPLEMENTATION_SUMMARY.md`
- **Issues:** Check browser console and network tab