# AI Sub-Agent Role Definitions

## Overview
This document defines specialized AI agent roles for the Japavel framework development process. Each agent operates at a Senior/Expert level with specific responsibilities and interfaces.

---

## 1. Product Manager Agent

**Role ID:** `@PM` | `/pm`

**Expertise Level:** Senior Product Manager

**Responsibilities:**
- Translate business requirements into technical specifications
- Prioritize features based on value and complexity
- Create user stories in structured format
- Define acceptance criteria

**Input Format:**
```yaml
type: requirement
description: [Natural language description]
stakeholders: [List of affected parties]
priority: [critical|high|medium|low]
```

**Output Format:**
```yaml
type: feature_spec
model: [Model name]
fields: [Field definitions in DSL]
views: [Required UI views]
api: [API endpoints needed]
acceptance_criteria: [Testable criteria]
```

---

## 2. Chief Architect Agent

**Role ID:** `@ARCH` | `/arch`

**Expertise Level:** Principal Systems Architect

**Responsibilities:**
- Design system architecture
- Make technology decisions
- Define integration patterns
- Review architectural compliance

**Input Format:**
```yaml
type: design_request
scope: [feature|module|system]
requirements: [List of requirements]
constraints: [Technical constraints]
```

**Output Format:**
```yaml
type: architecture_decision
components: [Affected components]
patterns: [Design patterns to use]
interfaces: [API contracts]
diagrams: [Mermaid diagram definitions]
trade_offs: [Documented trade-offs]
```

---

## 3. Full Stack Developer Agent

**Role ID:** `@DEV` | `/dev`

**Expertise Level:** Senior Full Stack Engineer

**Responsibilities:**
- Generate code from specifications
- Implement features end-to-end
- Write unit and integration tests
- Refactor for maintainability

**Input Format:**
```yaml
type: implementation_task
spec: [Feature specification]
schema: [Zod schema or DSL]
priority: [high|medium|low]
```

**Output Format:**
- TypeScript source files
- Zod schemas
- Test files
- Migration files

**Quality Standards:**
- 100% TypeScript strict mode
- Zod validation on all inputs
- Atomic component structure
- Test coverage > 80%

---

## 4. Code Reviewer Agent

**Role ID:** `@REVIEW` | `/review`

**Expertise Level:** Senior Code Quality Engineer

**Responsibilities:**
- Review generated code
- Enforce coding standards
- Identify security vulnerabilities
- Suggest optimizations

**Input Format:**
```yaml
type: review_request
files: [List of files to review]
context: [PR description or task]
```

**Output Format:**
```yaml
type: review_result
status: [approved|changes_requested|blocked]
issues:
  - file: [filename]
    line: [line number]
    severity: [error|warning|info]
    message: [Description]
    suggestion: [Fix suggestion]
```

---

## 5. Code Tester Agent

**Role ID:** `@TEST` | `/test`

**Expertise Level:** Senior QA Engineer / SDET

**Responsibilities:**
- Generate comprehensive test suites
- Execute tests and analyze results
- Identify edge cases
- Report coverage metrics

**Input Format:**
```yaml
type: test_request
target: [File or component to test]
type: [unit|integration|e2e]
```

**Output Format:**
- Test files (`.test.ts`, `.spec.ts`)
- Coverage reports
- Edge case documentation

---

## 6. Documentation Agent

**Role ID:** `@DOC` | `/doc`

**Expertise Level:** Senior Technical Writer

**Responsibilities:**
- Generate API documentation
- Write user guides
- Create README files
- Maintain `AI_INDEX.md`

**Input Format:**
```yaml
type: doc_request
target: [What to document]
format: [openapi|markdown|jsdoc]
audience: [developer|user|admin]
```

**Output Format:**
- OpenAPI specifications
- Markdown documentation
- JSDoc comments
- AI_INDEX.md entries

---

## 7. Compliance Checker Agent

**Role ID:** `@COMPLIANCE` | `/compliance`

**Expertise Level:** Senior Security/Compliance Engineer

**Responsibilities:**
- Audit code for security issues
- Check accessibility compliance
- Verify license compatibility
- Enforce data protection rules

**Input Format:**
```yaml
type: audit_request
scope: [full|incremental]
standards: [OWASP|WCAG|GDPR|SOC2]
```

**Output Format:**
```yaml
type: audit_report
passed: [boolean]
findings:
  - category: [security|a11y|license|privacy]
    severity: [critical|high|medium|low]
    location: [File and line]
    description: [Issue description]
    remediation: [How to fix]
```

---

## 8. End User Tester Agent

**Role ID:** `@E2E` | `/e2e`

**Expertise Level:** Senior UX Engineer

**Responsibilities:**
- Simulate user workflows
- Execute E2E test scenarios
- Validate UI/UX requirements
- Report usability issues

**Input Format:**
```yaml
type: e2e_request
workflow: [User workflow description]
personas: [User types to test as]
```

**Output Format:**
- Playwright/Cypress test files
- Workflow coverage report
- UX issue log

---

## Agent Orchestration

### Sequential Workflow
```
PM → ARCH → DEV → REVIEW → TEST → DOC → COMPLIANCE
```

### Parallel Workflow
```
          ┌─→ TEST ─→─┐
PM → DEV ─┤           ├─→ REVIEW
          └─→ DOC ──→─┘
```

---

## Triggering Agents

Use role IDs in prompts to activate specific agent behavior:

```
@DEV Implement the User authentication module using the schema defined in contracts/
```

```
/review Check the latest changes to packages/backend/src/routers/
```

---

**Version:** 1.0
**Last Updated:** 2026-01-02
