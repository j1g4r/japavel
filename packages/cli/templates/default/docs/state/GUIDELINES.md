# AI Guidelines & Operational Rules

## Purpose
This document provides strict operational rules for AI agents working on the Japavel framework.

---

## READ FIRST: Calibration Protocol

Before ANY action, you MUST:

1. **Create/Read** `docs/state/PROJECT_STATE.md` to understand current status
2. **Create/Check** `task.md` or breakdown document for pending tasks
3. **Create/Review** `implementation_plan.md` for architectural decisions
4. **Create/Consult** `AI_INDEX.md` for similar past solutions

> [!CAUTION]
> Never proceed with code generation without completing calibration steps.

---

## Core Operational Rules

### 1. Zero-Stop Execution
- Once a task is clear, execute it completely
- Do NOT ask "Should I continue?" or "Is this okay?"
- Only stop when verification passes or you need clarification

### 2. Contract-First Development
- **Every feature** must start with a Zod schema definition
- Types are GENERATED, never manually written
- If the schema changes, regenerate all dependent code

### 3. Atomic Component Rule
- One component = One function
- Maximum 200 lines per file
- Split: View | Logic | Styles | Types

### 4. Self-Healing Loop
When code fails:
```
1. Capture EXACT error message
2. Analyze root cause
3. Apply fix
4. Run verification
5. Repeat until SUCCESS
```

> [!WARNING]
> After 3 failed attempts with the same error, STOP and pivot your strategy.

---

## Code Generation Standards

### TypeScript
- Strict mode enabled (`"strict": true`)
- No `any` types (use `unknown` if needed)
- All functions must have explicit return types
- Use Zod schemas for runtime validation

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Types: `{name}.types.ts`
- Schemas: `{name}.schema.ts`

### Project Structure
```
packages/
├── contracts/     # Schemas & types (SHARED)
├── core/          # Framework runtime
├── mcp-server/    # AI integration
├── frontend/      # UI components
└── backend/       # API layer
```

---

## Forbidden Actions

❌ Do NOT:
- Write types manually when they can be inferred from Zod
- Create components larger than 200 lines
- Skip verification steps
- Use `console.log` for debugging (use structured logger)
- Commit code that doesn't pass TypeScript checks

---

## AI Index Protocol

### After completing any task, INDEX:
1. **Request Summary:** What was asked
2. **Solution Components:** Technologies, patterns used
3. **Key Code Snippets:** Reusable logic
4. **Issues Encountered:** Pitfalls to avoid

### Before starting any task, RETRIEVE:
1. Search `AI_INDEX.md` for similar solutions
2. Check known pitfalls for the technology
3. Reuse proven patterns

---

## Verification Checklist

Before marking ANY task complete:

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Unit tests pass
- [ ] Integration tests pass (if applicable)
- [ ] Code follows atomic component rules
- [ ] Changes are indexed in `AI_INDEX.md`

---

**Version:** 1.0
**Last Updated:** 2026-01-02
