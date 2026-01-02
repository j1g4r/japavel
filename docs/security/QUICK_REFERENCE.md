# Quick Reference: Security Fixes

**Project:** Japavel Framework  
**Last Updated:** 2025-01-09  
**Full Report:** SECURITY_VULNERABILITY_REPORT.md

---

## 🚨 CRITICAL - Fix Before Production

### 1. Update MCP SDK
```bash
npm install @modelcontextprotocol/sdk@^1.24.0
```
**Why:** DNS rebinding vulnerability (GHSA-w48q-cv73-mx4w)

---

### 2. Fix Hardcoded Salt
**Location:** `packages/backend/src/security/encryption.ts:44`

```typescript
// Replace:
'sjapavel-encryption-salt'

// With:
const salt = process.env.ENCRYPTION_SALT || crypto.randomBytes(32).toString('hex');
```

Add to `.env`:
```bash
ENCRYPTION_SALT=generate-32-char-random-string-here
```

---

### 3. Implement Persistent Sessions
**Location:** `packages/backend/src/security/auth.ts`

Install Redis:
```bash
npm install ioredis
```

Replace `Map` storage with Redis:
```typescript
import Redis from 'ioredis';
private redis = new Redis(process.env.REDIS_URL);

async create(...) {
  await this.redis.setex(`session:${session.id}`, expiresIn, JSON.stringify(session));
}
```

---

### 4. Replace Mock Auth
**Location:** `packages/backend/src/Http/Controllers/AuthController.ts`

```typescript
static async login(req: Request, res: Response) {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  const valid = await passwordUtils.verify(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  
  const session = await sessionManager.create(user.id, { ip: req.ip });
  return res.json({ token: session.token });
}
```

---

### 5. Migrate to PostgreSQL
**Location:** `packages/backend/prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

Add to `.env`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/japavel"
```

Run:
```bash
npm install prisma @prisma/client
npx prisma generate
npx prisma db push
```

---

## ⚠️ HIGH - Fix Within 1 Week

### 6. Update Vite
```bash
npm install vite@^7.3.0 --save-dev
```

---

### 7. Add Input Validation
**Location:** `packages/backend/src/Http/Controllers/AuthController.ts`

```typescript
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

static async login(req: Request, res: Response) {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Validation error' });
  }
  const { email, password } = result.data;
  // ... rest
}
```

---

### 8. Add Rate Limiting
```bash
npm install express-rate-limit
```

**Location:** `packages/backend/src/routes/api.ts`

```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
});

Route.post('/login', authLimiter, AuthController.login);
```

---

## 💡 MEDIUM - Fix Within 2 Weeks

### 9. Add Security Headers
```bash
npm install helmet
```

```typescript
import helmet from 'helmet';

app.use(helmet({
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));
```

---

### 10. Configure CORS
```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}));
```

---

### 11. Remove console.log
```bash
npm install winston
```

Replace all `console.log()` with:
```typescript
logger.info('Message', { maskedData });
```

---

### 12. Validate Environment Variables
**Create:** `packages/backend/src/config/env.ts`

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  ENCRYPTION_KEY: z.string().length(32),
  JWT_SECRET: z.string().min(32),
});

export default envSchema.parse(process.env);
```

---

## 🔴 Checklist Summary

- [ ] 1. Update @modelcontextprotocol/sdk
- [ ] 2. Fix hardcoded salt
- [ ] 3. Implement Redis sessions
- [ ] 4. Replace mock auth
- [ ] 5. Migrate to PostgreSQL
- [ ] 6. Update Vite
- [ ] 7. Add input validation
- [ ] 8. Add rate limiting
- [ ] 9. Add security headers
- [ ] 10. Configure CORS
- [ ] 11. Replace console.log
- [ ] 12. Validate env vars

---

## 📊 Current Status

| Severity | Open | Fixed |
|----------|------|-------|
| Critical | 5 | 0 |
| High     | 4 | 0 |
| Medium   | 3 | 0 |
| Low      | 0 | 0 |

---

## 🛠️ Common Commands

```bash
# Check for vulnerabilities
npm audit

# Update all dependencies
npm update

# Run audit in production mode
npm audit --production

# Fix vulnerabilities automatically
npm audit fix
```

---

## ⚡ Quick Fixes Reference

**Hardcoded Secrets Search:**
```bash
grep -r "secret=" packages/
grep -r "password=" packages/
grep -r "api_key=" packages/
```

**Console Log Search:**
```bash
grep -r "console.log" packages/backend/src/
```

**Environment Variables Template:**
```bash
cp .env.example .env
# Edit .env with real values
```

---

## 📞 When to Escalate

- Cannot complete fix due to technical blockers
- Conflicting security requirements
- Unclear implementation guidance
- External service dependencies unavailable

---

**See Full Report:** `SECURITY_VULNERABILITY_REPORT.md`  
**Track Progress:** `REMEDIATION_CHECKLIST.md`
