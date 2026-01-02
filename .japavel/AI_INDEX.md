# AI Knowledge Index (AI_INDEX)

## Purpose
This file serves as a persistent knowledge base for AI agents working on the Japavel framework. It indexes successful patterns, known pitfalls, and reusable solutions to prevent "amnesic" hallucinations.

---

## 🔍 Retrieval Protocol
Before starting a task, search this file for:
1. **Keywords** related to your task (e.g., "zod", "trpc", "component")
2. **Patterns** that have been proven to work
3. **Pitfalls** to avoid

---

## 🧠 Solved Problems & Patterns

### 1. Contract-First Schema Definition
**Pattern:** Always define Zod schema first, then infer types.
**Code Snippet:**
```typescript
// packages/contracts/src/schemas/user.ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
  preferences: z.object({
    theme: z.enum(['light', 'dark']).default('system'),
  }).optional(),
});

export type User = z.infer<typeof UserSchema>;
```
**Why:** Ensures runtime validation matches compile-time types perfectly.

### 2. Atomic Component Structure
**Pattern:** Split component logic and view.
**Code Snippet:**
```typescript
// Component.logic.ts
export const useButtonLogic = (props: ButtonProps) => {
  const handleClick = () => { /* ... */ };
  return { handleClick };
};

// Component.tsx
export const Button = (props: ButtonProps) => {
  const { handleClick } = useButtonLogic(props);
  return <button onClick={handleClick}>{props.label}</button>;
};
```
**Why:** Reduces context window usage; easier to unit test logic.

### 3. MCP Tool Error Handling
**Pattern:** Wrap tool execution in try/catch and return structured error.
**Code Snippet:**
```typescript
try {
  // tool execution
} catch (error) {
  return {
    content: [{ type: "text", text: `Error: ${error.message}` }],
    isError: true,
  };
}
```
**Why:** Prevents the MCP server from crashing; gives AI readable error feedback.

### 4. AI Context Provider Pattern
**Pattern:** Use AIContextProvider to get project context before starting tasks.
**Code Snippet:**
```typescript
import { AIContextProvider } from './context/project-context';

const provider = new AIContextProvider(projectRoot);
const context = await provider.getProjectContext();
const taskContext = await provider.getTaskContext("Add user authentication");
```
**Why:** Provides relevant files, schemas, patterns, and pitfalls for the task.

### 5. Schema-Driven Code Generation
**Pattern:** Use DSL YAML files to generate Zod schemas, tRPC routers, and React components.
**Code Snippet:**
```yaml
# schemas/product.yaml
Model: Product
Fields:
  id: uuid
  name: string
  price: number
  category: enum(electronics, clothing, food)
API: crud
View: table
```
```typescript
import { parseDSL, generateAll } from '@japavel/core';

const schema = parseDSL('./schemas/product.yaml');
const code = generateAll(schema);
// code.zodSchema, code.trpcRouter, code.reactComponent, code.prismaModel
```
**Why:** Single source of truth; generates consistent, type-safe code.

### 6. Self-Healing Workflow
**Pattern:** Use self-healing workflow to automatically fix common errors.
**Code Snippet:**
```typescript
import { runSelfHealing } from '@japavel/core';

const result = await runSelfHealing(projectRoot, {
  maxAttempts: 3,
  fixStrategies: ['typescript', 'eslint', 'prisma'],
});

if (!result.success) {
  console.log('Manual intervention required:', result.errors);
}
```
**Why:** Reduces manual debugging; automatically fixes TypeScript and ESLint errors.

### 7. Verification Loop
**Pattern:** Run verification before marking tasks complete.
**Code Snippet:**
```typescript
import { fullVerify, quickVerify } from '@japavel/core';

// Quick check (TypeScript + ESLint)
const passed = await quickVerify(projectRoot);

// Full verification
const result = await fullVerify(projectRoot);
console.log(result.summary);
```
**Why:** Ensures code quality before committing; catches atomic rule violations.

### 8. RAG-Ready Documentation
**Pattern:** Use RAGDocumentBuilder for AI-optimized documentation.
**Code Snippet:**
```typescript
import { createDocumentBuilder, createCollectionManager } from '@japavel/core';

const doc = createDocumentBuilder()
  .setMetadata({ title: 'User Auth Guide', type: 'guide', tags: ['auth'] })
  .setSummary('Guide to implementing user authentication')
  .addSection({
    heading: 'Setup',
    level: 2,
    content: 'Install dependencies...',
    codeBlocks: [{ language: 'bash', code: 'pnpm add bcrypt' }],
    keywords: ['bcrypt', 'password', 'hashing'],
  })
  .addTechnologies(['typescript', 'trpc', 'prisma'])
  .build();

const collection = createCollectionManager('japavel-docs', './.japavel/docs');
collection.addDocument(doc);
await collection.save();
```
**Why:** Enables efficient AI retrieval; structured for semantic search.

---

## ⚠️ Known Pitfalls

### 1. Hallucinating Tailwind Classes
**Issue:** AI often invents non-existent Tailwind classes like `text-shadow-md`.
**Fix:** Stick to standard Tailwind utility classes. If a custom style is needed, define it in `tailwind.config.js` properly or use arbitrary values `[text-shadow:...]` sparingly.

### 2. tRPC Router Context
**Issue:** Forgetting to export the router type for the frontend.
**Fix:** Always export `AppRouter` type from the root router file.
```typescript
export type AppRouter = typeof appRouter;
```

### 3. Zod transformations
**Issue:** Using `.transform()` in schemas intended for form inputs can break bi-directional binding.
**Fix:** distinct schemas for *input* (API request) and *output* (DB response) if transformations are complex.

---

## 📊 Performance Metrics

| Task Type | Avg Time | Complexity | Success Rate |
|-----------|----------|------------|--------------|
| DSL Compilation | <100ms | Low | 99% |
| Full Build | ~2.5s | Medium | 95% |
| Test Suite | ~5s | High | 90% |

---

**Last Updated:** 2026-01-02
**Entries:** 8
