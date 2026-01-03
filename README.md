japavel/README.md
```

# Japavel: AI-Native Development Framework

> **One Contract. Zero Hallucinations.**

Japavel is an innovative development framework designed specifically for AI agents. It inverts traditional "human-friendly" design (implicit magic) for "AI-friendly" design (explicit contracts, strong typing, and discoverability). By establishing a single source of truth through Zod schemas, Japavel ensures that data models, types, validation logic, and database schemas remain perfectly synchronized—eliminating the common hallucinations and inconsistencies that plague AI-generated code.

---

## 🎯 The Problem Japavel Solves

Modern AI-assisted development faces significant challenges that Japavel directly addresses. Traditional frameworks rely on implicit conventions, hidden magic, and scattered type definitions that work well for human developers who can infer context but create confusion for AI agents operating without the benefit of institutional knowledge. When an AI agent encounters a codebase with implicit typing, undocumented assumptions, or magic methods, it must either guess (risking hallucinations) or spend excessive tokens asking clarifying questions. Japavel eliminates this friction by making everything explicit, discoverable, and contract-driven. Every piece of data is governed by a Zod schema that serves as the authoritative source of truth, enabling AI agents to understand the data model immediately without guesswork or research.

The framework also solves the synchronization problem that plagues most projects. In conventional architectures, the same data model is often defined in multiple places—TypeScript types, database schemas, API documentation, validation logic—and these definitions inevitably drift apart over time. AI agents, relying on outdated or inconsistent definitions, generate code that fails at runtime. Japavel's contract-first approach breaks this cycle by generating types, validation, and database schemas automatically from a single Zod schema definition.

---

## ✨ Key Features

Japavel provides a comprehensive suite of features that collectively enable reliable AI-assisted development at enterprise scale.

**Contract-First Architecture** represents the foundational principle of Japavel. Data models are defined once using Zod schemas, and all subsequent artifacts—TypeScript types, runtime validation, database schemas, API contracts, and frontend components—flow automatically from this single source of truth. This approach ensures complete consistency between all layers of the application and provides AI agents with a definitive reference for understanding data structures.

**JUI Framework** delivers a custom, TypeScript-only UI framework built specifically for AI-generated code. JUI incorporates kinetic animations, glassmorphism aesthetics, and modern design patterns while maintaining zero dependency on external CSS frameworks like Tailwind. This self-contained approach ensures that AI-generated UI components are visually consistent, performant, and free from version conflicts or missing dependencies.

**AI Interface Layer (MCP)** provides a built-in Model Context Protocol server that enables AI agents to "plug in" to your project. Through this interface, AI agents can read project state, execute tools, debug errors, and understand the codebase structure without requiring human intervention or external documentation. This creates a true partnership between human developers and AI assistants.

**Atomic Component System** enforces a strict architecture where components remain small, focused, and single-purpose. By constraining components to approximately 200 lines or less and separating logic from presentation, Japavel ensures that AI agents can easily read, understand, and modify individual components without requiring understanding of the entire application.

**Self-Healing Workflows** integrate intelligent feedback loops that catch build errors, analyze their root causes, and feed corrections back to the AI for automatic remediation. This dramatically reduces the back-and-forth between humans and AI agents during development cycles.

**AI-Optimized DSL** offers a simple shorthand language that compiles into full-stack boilerplate. By defining models in concise YAML or JSON format, developers (and AI agents) can scaffold entire application sections with predictable, type-safe results.

---

## 🏗️ Architecture Overview

Japavel employs a carefully designed architecture that maximizes AI discoverability while maintaining enterprise-grade scalability and security.

```/dev/null/architecture_diagram.txt#L1-40
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           JAPAVEL ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        AI AGENT INTERFACE                                │   │
│  │    ┌───────────────────────────────────────────────────────────────┐    │   │
│  │    │                   MCP Server (Port 3001)                      │    │   │
│  │    │  • Tool Execution    • Context Reading    • State Awareness  │    │   │
│  │    └───────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         CORE LAYER                                       │   │
│  │    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐    │   │
│  │    │  DSL Parser     │  │  Code Generator │  │  Self-Healing Engine│    │   │
│  │    │  • YAML/JSON    │  │  • Zod Schemas  │  │  • Error Recovery   │    │   │
│  │    │  • Schema Defs  │  │  • tRPC Routers │  │  • Auto-Fix Rules   │    │   │
│  │    └─────────────────┘  └─────────────────┘  └─────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                    ┌─────────────────┼─────────────────┐                        │
│                    ▼                 ▼                 ▼                        │
│  ┌──────────────────────────┐  ┌──────────────┐  ┌──────────────────────┐      │
│  │      CONTRACTS           │  │   BACKEND    │  │      FRONTEND        │      │
│  │  ┌────────────────────┐  │  │ ┌──────────┐│  │  ┌──────────────────┐│      │
│  │  │   Zod Schemas      │◄─┼──┤ │ tRPC     ││◄─┼──┤ │  JUI Framework   ││      │
│  │  │   • User           │  │  │ │ Routers  ││  │  │  │  • Atoms        ││      │
│  │  │   • Product        │  │  │ └──────────┘│  │  │  │  • Molecules    ││      │
│  │  │   • Order          │  │  │              │  │  │  │  • Organisms    ││      │
│  │  │   • API Types      │  │  │ ┌──────────┐│  │  │  └──────────────────┘│      │
│  │  └────────────────────┘  │  │ │ Services ││  │  │                      │      │
│  │                          │  │ │ • Auth   ││  │  │ ┌──────────────────┐ │      │
│  │  Shared Across All       │  │ │ • Payment││  │  │ │  State Management│ │      │
│  │  Packages via Exports    │  │ │ • Data   ││  │  │ │  • Hooks         │ │      │
│  │                          │  │ └──────────┘│  │  │ │  • Context       │ │      │
│  └──────────────────────────┘  └──────────────┘  │  └──────────────────┘ │      │
│                                                  │                       │      │
│                                                  └───────────────────────┘      │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         INFRASTRUCTION LAYER                             │   │
│  │   PostgreSQL (Prisma)  │  Redis (Cache/Queue)  │  Docker  │  CI/CD     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 System Data Flow

The following diagram illustrates how data flows through the Japavel system from definition to execution, demonstrating the contract-first philosophy in action.

```/dev/null/data_flow_diagram.txt#L1-35
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW DIAGRAM                                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   1. SCHEMA DEFINITION                                                             │
│   ┌──────────────────────────────────────────────────────────────────────────┐     │
│   │  packages/contracts/src/schemas/user.ts                                   │     │
│   │  ─────────────────────────────────────────────────────────────           │     │
│   │  export const UserSchema = z.object({                                     │     │
│   │    id: z.string().uuid(),                                                 │     │
│   │    email: z.string().email(),                                             │     │
│   │    role: z.enum(['admin', 'user', 'guest']),                              │     │
│   │  });                                                                       │     │
│   │                                                                             │     │
│   │  export type User = z.infer<typeof UserSchema>;  // Auto-generated       │     │
│   └──────────────────────────────────────────────────────────────────────────┘     │
│                                      │                                              │
│                    ┌─────────────────┼─────────────────┐                            │
│                    ▼                 ▼                 ▼                            │
│                    │                 │                 │                            │
│   ┌───────────────┴──┐   ┌───────────┴───┐   ┌───────┴─────────┐                  │
│   │ TYPE GENERATION  │   │  DB SCHEMA    │   │ VALIDATION FN   │                  │
│   │                   │   │  GENERATION   │   │  GENERATION     │                  │
│   │ • Frontend Props │   │ • Prisma Model│   │ • Runtime Check │                  │
│   │ • API Responses  │   │ • Migrations  │   │ • Form Inputs   │                  │
│   │ • State Shapes   │   │ • Indexes     │   │ • API Bodies    │                  │
│   └───────────────────┘   └───────────────┘   └─────────────────┘                  │
│                                      │                                              │
│                                      ▼                                              │
│   2. IMPLEMENTATION LAYERS                                                          │
│   ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐    │
│   │      BACKEND        │  │      FRONTEND       │  │         DATABASE        │    │
│   │                     │  │                     │  │                         │    │
│   │  tRPC Procedures    │  │  JUI Components     │  │  PostgreSQL Tables      │    │
│   │  • Input: UserSchema│  │  • Props typed from │  │  • Users table          │    │
│   │  • Output: User     │  │    UserSchema       │  │  • Constraints          │    │
│   │  • Validation: auto │  │  • OnSubmit:        │  │  • Indexes              │    │
│   │                     │  │    validate()       │  │                         │    │
│   └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘    │
│                                      │                                              │
│                                      ▼                                              │
│   3. EXECUTION & VALIDATION                                                         │
│   ┌──────────────────────────────────────────────────────────────────────────┐     │
│   │                         RUNTIME FLOW                                      │     │
│   │                                                                          │     │
│   │   API Request ──► Input Validation (Zod) ──► Business Logic ──► Response│     │
│   │        │                  │                                              │     │
│   │        │                  ▼                                              │     │
│   │        │            400 Bad Request                                      │     │
│   │        │            (if invalid)                                         │     │
│   │        ▼                                                                  │     │
│   │   Frontend receives validated, type-safe User object                     │     │
│   └──────────────────────────────────────────────────────────────────────────┘     │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 AI Agent Workflow

The following flowchart demonstrates how AI agents interact with the Japavel framework, showcasing the self-healing and contract-first development cycle.

```/dev/null/agent_workflow.txt#L1-45
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                      AI AGENT WORKFLOW                                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  START                                                                              │
│    │                                                                                │
│    ▼                                                                                │
│  ┌─────────────────────────────────────┐                                           │
│  │  Read Project Context               │                                           │
│  │  • .cursorrules (coding standards)  │                                           │
│  │  • AI_INDEX.md (proven patterns)    │                                           │
│  │  • contracts/ (schema definitions)  │                                           │
│  └─────────────────────────────────────┘                                           │
│                    │                                                               │
│                    ▼                                                               │
│  ┌─────────────────────────────────────┐                                           │
│  │  Receive Task from Human/Orchestrator│                                          │
│  │  • Feature specification            │                                           │
│  │  • Schema reference                 │                                           │
│  │  • Acceptance criteria              │                                           │
│  └─────────────────────────────────────┘                                           │
│                    │                                                               │
│                    ▼                                                               │
│  ┌─────────────────────────────────────┐                                           │
│  │  Write Code                         │                                           │
│  │  • Create Zod schema (if new model) │                                           │
│  │  • Implement tRPC procedures        │                                           │
│  │  • Build JUI components             │                                           │
│  │  • Follow atomic pattern            │                                           │
│  └─────────────────────────────────────┘                                           │
│                    │                                                               │
│                    ▼                                                               │
│  ┌─────────────────────────────────────┐                                           │
│  │  Run Self-Healing Verification      │                                           │
│  │  $ pnpm verify                      │                                           │
│  └─────────────────────────────────────┘                                           │
│         │                    │                                                      │
│         │ SUCCESS            │ FAIL                                                │
│         ▼                    ▼                                                      │
│  ┌─────────────┐    ┌─────────────────────────────────┐                           │
│  │  Push Code  │    │  Analyze Error                 │                           │
│  │  (PR/Commit)│    │  • Parse TypeScript errors     │                           │
│  └─────────────┘    │  • Parse ESLint violations     │                           │
│                     │  • Check schema consistency    │                           │
│                     └─────────────────────────────────┘                           │
│                                  │                                                 │
│                                  ▼                                                 │
│                     ┌─────────────────────┐                                        │
│                     │  Auto-Fix            │                                        │
│                     │  • Apply fix rules   │                                        │
│                     │  • Regenerate types  │                                        │
│                     │  • Update schemas    │                                        │
│                     └─────────────────────┘                                        │
│                                  │                                                 │
│                                  ▼                                                 │
│                     ┌─────────────────────┐                                        │
│                     │  Retry (max 3x)     │──┐                                     │
│                     └─────────────────────┘  │                                     │
│                                  │          │                                     │
│                                  ▼          │                                     │
│                        ┌─────────────────┐  │                                     │
│                        │ All retries     │  │                                     │
│                        │ failed?         │──┘                                     │
│                        └─────────────────┘                                        │
│         │                    │                                                      │
│         │ NO                 │ YES                                                 │
│         ▼                    ▼                                                      │
│  ┌─────────────┐    ┌─────────────────────────────────┐                           │
│  │  ✓ Complete │    │  Report to Human                │                           │
│  │             │    │  • Error details                │                           │
│  │             │    │  • Context tried                │                           │
│  │             │    │  • Suggested manual fix         │                           │
│  └─────────────┘    └─────────────────────────────────┘                           │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

Japavel uses a carefully organized monorepo structure that maximizes code sharing while maintaining clear separation of concerns.

```
japavel/
├── .agent/                      # AI agent configuration and prompts
│   └── cursorrules              # Cursor AI rules for code generation
├── .japavel/                    # AI-specific documentation and indexes
│   ├── .cursorrules             # AI coding standards
│   └── AI_INDEX.md              # Knowledge base for AI agents
├── deploy/                      # Deployment configurations
│   ├── docker/
│   └── kubernetes/
├── docs/                        # Documentation
│   ├── agents/                  # Sub-agent role definitions
│   ├── architecture/            # Architecture decision records
│   ├── security/                # Security guidelines
│   └── state/                   # Project state documentation
├── packages/                    # Monorepo packages
│   ├── contracts/               # Shared Zod schemas (The Source of Truth)
│   │   └── src/
│   │       └── schemas/         # Domain models (User, Product, Order, etc.)
│   ├── backend/                 # Logic layer (Node.js/Express/tRPC)
│   │   └── src/
│   │       ├── routers/         # tRPC routers
│   │       ├── services/        # Business logic services
│   │       ├── middleware/      # Auth, logging, validation
│   │       └── db/              # Prisma client and migrations
│   ├── frontend/                # View layer (React + JUI Framework)
│   │   └── src/
│   │       ├── components/      # Atomic component library
│   │       │   ├── atoms/       # Buttons, inputs, labels (single responsibility)
│   │       │   ├── molecules/   # Form groups, cards (composed atoms)
│   │       │   └── organisms/   # Complex UI sections (composed molecules)
│   │       ├── pages/           # Route-level components
│   │       ├── hooks/           # Custom React hooks
│   │       └── utils/           # Frontend utilities
│   ├── core/                    # CLI, DSL parsers, and code generators
│   │   └── src/
│   │       ├── cli/             # Command-line interface
│   │       ├── dsl/             # Schema definition language parser
│   │       ├── generators/      # Code generation logic
│   │       └── self-healing/    # Error detection and auto-fix
│   ├── mcp-server/              # AI Integration Server (Model Context Protocol)
│   │   └── src/
│   │       ├── tools/           # Exposed tools for AI agents
│   │       ├── context/         # Project state awareness
│   │       └── handlers/        # Tool execution handlers
│   └── vscode-extension/        # IDE integration
├── node_modules/                # Dependencies
├── .gitignore                   # Git ignore rules
├── AI_INDEX.md                  # AI knowledge index (legacy)
├── STACK.md                     # Technology stack documentation
├── project_state.md             # Current project status
├── package.json                 # Root package configuration
├── turbo.json                   # Turborepo configuration
└── tsconfig.base.json           # TypeScript base configuration
```

---

## 🛠️ Benefits of Using Japavel

Japavel delivers substantial benefits across multiple dimensions of software development, from developer productivity to system reliability.

**Zero Hallucination Development** represents the most significant benefit. By establishing explicit contracts that govern all data structures and providing AI agents with a single source of truth, Japavel eliminates the guesswork that leads to incorrect type assumptions, misaligned expectations, and runtime errors. AI agents working with Japavel codebases can verify their assumptions against the canonical schema definition, reducing error rates dramatically compared to conventional development approaches.

**Dramatically Accelerated Development Cycles** emerge from the combination of contract-first workflows and self-healing capabilities. When AI agents can generate correct code on the first attempt—validated against explicit schemas rather than inferred assumptions—development velocity increases substantially. The self-healing system further compounds this benefit by automatically resolving common errors that would traditionally require human intervention.

**Enterprise-Grade Consistency** becomes achievable even in large teams with varying skill levels. The atomic component system, enforced through tooling and linting, ensures that all code follows the same patterns regardless of who (or what) wrote it. This consistency dramatically reduces code review friction and onboarding time while improving maintainability.

**Multi-Layer Synchronization** eliminates a persistent source of technical debt. Because types, validation, and database schemas all derive from the same Zod definition, they can never drift out of sync. Adding a field to a schema automatically propagates that change to all dependent artifacts, eliminating the forgotten update that causes runtime errors in production.

**AI Agent Integration** through the built-in MCP server transforms how AI assistants interact with your project. Rather than treating the AI as an external tool that must be constantly updated with project state, Japavel makes the AI a first-class participant in the development process with direct access to project structure, state, and execution capabilities.

**Improved Debugging and Observability** results from the explicit nature of all contracts. When an error occurs, the failure point clearly indicates whether it originated from a schema definition mismatch, validation failure, or business logic error. This clarity accelerates root cause analysis and reduces Mean Time To Recovery (MTTR).

**Scalable Architecture Patterns** built into Japavel provide proven solutions for common enterprise challenges. Multi-tenancy support, distributed caching, rate limiting, and audit logging are all integrated into the framework, allowing teams to focus on business logic rather than infrastructure concerns.

---

## 🤖 Usage for AI Agents

AI agents working with Japavel should follow this systematic approach to ensure successful, consistent code generation.

**Begin by Reading the Rules.** The `.japavel/.cursorrules` file contains the definitive coding standards that all AI-generated code must follow. This file documents the atomic component pattern, type strictness requirements, and the contract-first workflow that governs all development activities.

**Check the Index for Patterns.** The `.japavel/AI_INDEX.md` file contains proven solutions to common problems that AI agents encounter. Before implementing a feature, search this index for relevant patterns—many challenges have already been solved in ways that work well within the Japavel ecosystem.

**Follow the Current Plan.** Refer to `docs/state/PROJECT_STATE.md` to understand what work is in progress, what has been completed, and what remains to be done. This prevents duplicate work and ensures alignment with the current development direction.

**Adopt the Appropriate Persona.** When implementing features, adopt the persona defined in `docs/agents/SUBAGENT_ROLES.md`. The Full Stack Developer role, Code Reviewer role, and other specialized personas each have distinct responsibilities and output formats that maintain consistency across the codebase.

**Always Generate Types from Schemas.** Never write TypeScript types manually. Always infer types from Zod schemas using `z.infer<typeof SchemaName>` to ensure type consistency with validation logic.

**Keep Components Atomic.** Split logic from presentation and keep each file under 200 lines. Use the Atomic Component pattern documented in `AI_INDEX.md` to ensure components remain single-purpose and AI-readable.

---

## 🚀 Getting Started

### Prerequisites

Before installing Japavel, ensure your development environment meets the following requirements. Node.js version 20 or higher provides the necessary runtime features and performance characteristics. pnpm version 8 or higher delivers fast, disk-space-efficient dependency management optimized for monorepo workflows. Git must be installed for version control operations, and a PostgreSQL database (local or cloud-hosted) is required for the backend layer.

### Installation

Clone the repository and install dependencies using the following commands. The installation process uses pnpm's workspace feature to simultaneously install dependencies for all packages in the monorepo.

```bash
# Clone the repository
git clone https://github.com/j1g4r/japavel.git
cd japavel

# Install dependencies for all packages
pnpm install
```

### Development

The development workflow leverages Turbo to run tasks across all packages in parallel. The following commands cover the most common development operations.

```bash
# Start the complete development environment
# Runs Frontend, Backend, and MCP Server concurrently
pnpm dev

# Run the self-healing verification loop
# Automatically detects and fixes common errors
pnpm verify

# Build all packages for production
pnpm build:all

# Run tests across all packages
pnpm test:all

# Lint code across all packages
pnpm lint:all

# Clean build artifacts
pnpm clean

# Format code with Prettier
pnpm format
```

---

## ⌨️ CLI Usage

The Japavel CLI provides commands for scaffolding new projects, generating code from schemas, and managing the development workflow.

```bash
# Navigate to the CLI package
cd packages/cli

# Install dependencies and build
npm install && npm run build

# Create a symlink to use the CLI globally
npm link

# Create a new project with Japavel
japavel new my-app

# Generate code from a DSL schema file
japavel generate --schema schemas/product.yaml

# Run self-healing verification on a project
japavel heal --path ./my-project --max-attempts 3

# Scaffold a new feature with all required files
japavel scaffold --name UserAuth --model User
```

---

## 📋 Development Workflow

The following step-by-step workflow demonstrates how to implement a new feature using the contract-first approach.

**Step 1: Define the Schema.** Create or update a Zod schema in `packages/contracts/src/schemas/` that defines the data model for your feature. This schema serves as the single source of truth for all subsequent implementations.

**Step 2: Generate Types.** TypeScript types are automatically inferred from the Zod schema using `z.infer<typeof SchemaName>`. Export the type from the schema file for use in other packages.

**Step 3: Implement Backend Logic.** Create tRPC routers in `packages/backend/src/routers/` that operate on the schema. Use the schema for input validation in procedure definitions, ensuring runtime validation matches compile-time types.

**Step 4: Implement Frontend Components.** Build JUI components in `packages/frontend/src/components/` that accept props matching the schema types. Separate component logic from presentation using the atomic pattern.

**Step 5: Verify with Self-Healing.** Run `pnpm verify` to check for TypeScript errors, ESLint violations, and schema inconsistencies. The self-healing engine will automatically fix common issues.

**Step 6: Review and Commit.** Submit code for review, ensuring all generated artifacts are consistent with the schema definitions. Merge changes trigger automatic documentation updates.

---

## 🔧 Technology Stack

Japavel's technology stack reflects careful selection of tools that maximize type safety, developer productivity, and AI compatibility.

**Runtime and Language** center on Node.js for the backend runtime and TypeScript as the universal language across all packages. TypeScript's static typing provides the foundation for AI agent code generation, while Node.js delivers the performance and ecosystem necessary for production deployments.

**Backend Technologies** include Express.js for HTTP handling, tRPC for type-safe API definitions, PostgreSQL with Prisma ORM for database operations, and Redis for caching and queue management. Zod provides runtime validation that mirrors TypeScript compile-time types, ensuring data integrity across all system boundaries.

**Frontend Technologies** encompass React with Vite for the view layer, JUI (a custom framework) for component architecture, and Tailwind CSS combined with custom CSS variables for styling. State management leverages React hooks and context patterns optimized for atomic component structure.

**Architecture and Tooling** utilize Turbo for monorepo management, enabling efficient parallel builds and intelligent caching. Docker provides containerization for consistent deployments, while GitHub Actions powers CI/CD pipelines.

---

## 🏢 Enterprise Features

Japavel includes enterprise-grade features designed for large-scale organizational use.

**Multi-Tenancy Support** via `AsyncLocalStorage` and middleware enables logical separation of data and configurations for different customers within a single deployment. This architecture reduces operational overhead while maintaining strong isolation guarantees.

**Distributed Systems Capabilities** including Redis-based caching, rate limiting, and background job queues support high-throughput production workloads. These capabilities are integrated into the framework rather than requiring separate implementation for each project.

**Security Framework** encompasses RBAC (Role-Based Access Control) and ABAC (Attribute-Based Access Control) authorization models, AES-256 encryption for sensitive data at rest, and compliance features supporting GDPR requirements. The security layer is documented in `docs/security/`.

**SaaS Enablement** features including feature flags, usage metering, and audit logging support software-as-a-service business models. These capabilities are accessible through the contracts package and integrate with the backend services layer.

---

## 📄 License

Japavel is licensed under the MIT License, allowing unrestricted use, modification, and distribution in both commercial and open-source contexts. See the LICENSE file for complete terms.

---

## 🤝 Contributing

Contributions to Japavel are welcome and encouraged. Before submitting pull requests, please review the AI coding rules in `.japavel/.cursorrules` and the pattern library in `AI_INDEX.md` to ensure your contributions align with the framework's architectural philosophy.

---

## 📞 Support

For questions, issues, or feature requests, please open an issue on the GitHub repository. For enterprise support or consulting opportunities, contact the maintainers through official channels.

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-02  
**Maintainer:** Japavel Team