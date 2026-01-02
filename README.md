# Japavel: AI-Native Development Framework

> **One Contract. Zero Hallucinations.**

Japavel is a development framework designed specifically for AI agents. It inverts traditional "human-friendly" design (implicit magic) for "AI-friendly" design (explicit contracts, strong typing, and discoverability).

---

## 🚀 Key Features

- **Contract-First Architecture:** Define data models once using Zod. Types, validation, and database schemas flow from this single source of truth.
- **AI Interface Layer (MCP):** Built-in Model Context Protocol server lets AI agents "plug in" to your project to read state, run tools, and debug errors.
- **Atomic Component System:** Enforces small, single-purpose components that LLMs can easily read, understand, and modify.
- **Self-Healing Workflows:** Integrated feedback loops that catch build errors and feed them back to the AI for automatic correction.
- **AI-Optimized DSL:** A simple shorthand language that compiles into full-stack boilerplate.

---

## 📂 Project Structure

```
japavel/
├── .japavel/              # AI Documentation & Indexes
├── packages/
│   ├── contracts/       # Shared Zod Schemas & Types (The Source of Truth)
│   ├── frontend/        # View Layer (Atomic Components)
│   ├── backend/         # Logic Layer (tRPC + Services)
│   ├── core/            # CLI & Generators
│   └── mcp-server/      # AI Integration Server
└── dsl/                 # .japavel schema definitions
```

---

## 🤖 Usage for AI Agents

1. **Read the Rules:** Start by reading `.japavel/.cursorrules` to understand the coding standards.
2. **Check the Index:** Look at `.japavel/AI_INDEX.md` for proven patterns.
3. **Follow the Plan:** Refer to `docs/state/PROJECT_STATE.md` for current tasks.
4. **Use Sub-Agents:** Adopt the persona defined in `docs/agents/SUBAGENT_ROLES.md`.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+

### Installation
```bash
git clone https://github.com/j1g4r/japavel.git
cd japavel
pnpm install
```

### Development
```bash
# Start the development server (Frontend + Backend + MCP)
pnpm dev

# Run the self-healing verification loop
pnpm verify
```

## ⌨️ CLI Usage

Japavel includes a CLI to scaffold new projects.

```bash
# From the repository root
cd packages/cli
npm install && npm run build
npm link

# Create a new project
japavel new my-app
```

---

## 📄 License
MIT
