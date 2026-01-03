# Authentication System Documentation

## Overview

This document describes the authentication and session management system for the Japavel application. The system provides secure user authentication with session management, auto-logout on inactivity, and "remember me" functionality.

## Features

### 1. Secure Authentication
- JWT-based authentication with access and refresh tokens
- Password hashing with Argon2id algorithm
- Rate limiting for login attempts
- Account lockout after failed attempts
- Session management with Redis persistence

### 2. Session Management
- **Default Session**: 24 hours expiration
- **Remember Me**: 12 hours expiration when checkbox is checked
- Auto-refresh tokens before expiration (for remember me sessions)
- Maximum 5 concurrent active sessions per user

### 3. Inactivity Tracking
- **Auto-Logout**: 30 minutes of inactivity for regular sessions
- **Remember Me Sessions**: No auto-logout on inactivity (keeps session until manual logout or expiration)
- Tracks user activity: mouse movements, clicks, scrolling, touch events, and keyboard input

### 4. Route Protection
- Navigation guards to protect authenticated routes
- Prevents browser back button from accessing protected pages after logout
- Redirects unauthenticated users to login page
- Redirects authenticated users away from login/register pages

### 5. Token Management
- Secure token storage (localStorage for remember me, sessionStorage otherwise)
- Automatic token refresh before expiration
- Clear tokens on logout

## Architecture

### Backend Components

#### AuthController (`/packages/backend/src/controllers/AuthController.ts`)
Handles authentication endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (with remember me support)
- `POST /api/auth/logout` - Logout current session
- `POST /api/auth/logout-all` - Logout from all devices
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/me` - Get current user information

#### SessionManager (`/packages/backend/src/security/auth.ts`)
Manages sessions with Redis:
- Create sessions with configurable expiration
- Track user activity
- Revoke sessions
- Manage concurrent sessions (max 5 per user)

### Frontend Components

#### Auth Store (`/packages/frontend/src/stores/auth.ts`)
Centralized authentication state management:
```typescript
import { useAuth } from '@/stores/auth';

// In your component
const auth = useAuth();

// Login
await auth.login(email, password, rememberMe);

// Logout
await auth.logout();

// Check authentication status
if (auth.checkAuth()) {
  // User is authenticated
}

// Get current user
console.log(auth.user.value);
```

#### Router Guards (`/packages/frontend/src/router/index.ts`)
Protects routes based on authentication:
- Redirects to login for protected routes
- Redirects to dashboard for guest pages when authenticated
- Prevents back button navigation after logout

## Usage

### Setup Environment Variables

Create a `.env` file in the frontend directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Environment
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### Implementing Login

```typescript
import { useAuth } from '@/stores/auth';
import { ref } from 'vue';

export default defineComponent({
  setup() {
    const auth = useAuth();
    const email = ref('');
    const password = ref('');
    const rememberMe = ref(false);

    const handleLogin = async () => {
      try {
        await auth.login(email.value, password.value, rememberMe.value);
        // Redirect happens automatically
      } catch (error) {
        // Handle error
      }
    };

    return { email, password, rememberMe, handleLogin };
  }
});
```

### Implementing Logout

```typescript
import { useAuth } from '@/stores/auth';

export default defineComponent({
  setup() {
    const auth = useAuth();

    const handleLogout = async () => {
      await auth.logout();
      // Redirect to login happens automatically
    };

    return { handleLogout };
  }
});
```

### Protecting Routes

Routes are automatically protected using the `requiresAuth` meta field:

```typescript
{
  path: '/dashboard',
  name: 'dashboard',
  component: Dashboard,
  meta: { requiresAuth: true }
}
```

### Making Authenticated API Requests

Use the auth store to get the authorization header:

```typescript
import { useAuth } from '@/stores/auth';

const auth = useAuth();

const fetchData = async () => {
  const headers = {
    'Content-Type': 'application/json',
    ...auth.getAuthHeader()
  };

  const response = await fetch('/api/some-protected-route', {
    method: 'GET',
    headers
  });
};
```

## Session Behavior

### Regular Session (Remember Me Unchecked)
- **Expiration**: 24 hours from login
- **Inactivity Timeout**: 30 minutes
- **Storage**: `sessionStorage`
- **Auto-Logout**: Yes, after 30 minutes of inactivity OR 24-hour expiration

### Remember Me Session (Remember Me Checked)
- **Expiration**: 12 hours from login (or last refresh)
- **Inactivity Timeout**: None
- **Storage**: `localStorage`
- **Auto-Logout**: No (only on manual logout or 12-hour expiration)
- **Auto-Refresh**: Tokens refresh automatically when less than 1 hour remains

## Security Features

### Rate Limiting
- **Login Attempts**: Max 5 attempts per 15 minutes per email
- **Account Lockout**: 30 minutes after 5 failed attempts
- **General API**: Rate limits on all endpoints

### Password Security
- **Minimum Length**: 8 characters
- **Requirements**: 
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Hashing**: Argon2id algorithm with salt

### Session Security
- Tokens stored securely with expiration
- CSRF protection via same-site cookies (when applicable)
- IP and user agent tracking for sessions
- Automatic session cleanup on expiration

### Token Management
- Access tokens: Short-lived (used for API requests)
- Refresh tokens: Long-lived (used to get new access tokens)
- Secure token transmission via Authorization header
- Tokens invalidated on logout

## Troubleshooting

### User Can't Stay Logged In
1. Check browser console for errors
2. Verify API base URL is correct in environment variables
3. Check Redis connection in backend
4. Verify token is being stored in browser storage

### Auto-Logout Not Working
1. Verify activity tracking is initialized
2. Check browser console for timer errors
3. Ensure remember me is not checked if auto-logout is desired

### Can't Access Protected Routes
1. Verify user is authenticated
2. Check token is still valid
3. Verify route meta field includes `requiresAuth: true`

### Back Button Still Works After Logout
1. Verify router afterEach guard is properly configured
2. Check browser supports pushState
3. Clear browser cache and try again

## API Reference

### Login Endpoint

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "rememberMe": true
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "access_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Logout Endpoint

**Request:**
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

## Best Practices

1. **Always use HTTPS** in production
2. **Keep tokens secure** - never expose in URLs or logs
3. **Implement proper error handling** for authentication failures
4. **Log out on sensitive operations** if security is a concern
5. **Monitor failed login attempts** for suspicious activity
6. **Keep dependencies updated** for security patches
7. **Use strong password policies**
8. **Implement MFA** for sensitive accounts (future enhancement)

## Future Enhancements

- [ ] Multi-factor authentication (MFA)
- [ ] Social login (Google, GitHub, etc.)
- [ ] Password reset via email
- [ ] Email verification
- [ ] OAuth 2.0 / OpenID Connect
- [ ] Biometric authentication support
- [ ] Device management
- [ ] Session analytics dashboard
- [ ] Audit logging