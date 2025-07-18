# 🏗️ Conduit Portfolio - Project Structure Reference

> **Enterprise-grade monorepo structure following Google's standards**  
> This document serves as the definitive guide for understanding the project organization, technology choices, and development guidelines.

## 📋 **Table of Contents**

- [Overview](#overview)
- [Root Directory](#root-directory)
- [Applications (`apps/`)](#applications-apps)
- [Shared Packages (`packages/`)](#shared-packages-packages)
- [Development Tools (`tools/`)](#development-tools-tools)
- [Documentation (`docs/`)](#documentation-docs)
- [Infrastructure (`infrastructure/`)](#infrastructure-infrastructure)
- [Development Workflow](#development-workflow)
- [Technology Decisions](#technology-decisions)

---

## 🎯 **Overview**

The Conduit Portfolio project follows **Google's monorepo standards** with a clear separation of concerns:

```
conduit-portfolio/
├── apps/                    # 📱 Deployable applications
├── packages/               # 📦 Shared libraries and utilities
├── tools/                  # 🔧 Build tools and development scripts
├── docs/                   # 📚 Project documentation
├── infrastructure/         # 🏗️ Infrastructure as Code
├── turbo.json             # ⚡ Turborepo configuration
├── package.json           # 📋 Root workspace configuration
└── README.md              # 📖 Project overview
```

**Core Principles:**
- **Single source of truth** for dependencies and configuration
- **Type-safe** across the entire stack with TypeScript
- **Enterprise-grade** patterns and practices
- **Scalable** architecture supporting team growth

---

## 📁 **Root Directory**

### Key Files

| File | Purpose | Technology |
|------|---------|------------|
| `package.json` | Root workspace configuration with yarn workspaces | Yarn 4+ |
| `turbo.json` | Monorepo build orchestration and caching | Turborepo |
| `tsconfig.json` | Base TypeScript configuration | TypeScript 5.3+ |
| `tsconfig.build.json` | Production build configuration | TypeScript |
| `.gitignore` | Git exclusions for monorepo | Git |
| `yarn.lock` | Dependency lock file (single source of truth) | Yarn |

### Configuration Strategy
- **Single dependency tree** managed at root level
- **Workspace references** using `workspace:*` pattern
- **Shared configurations** extended by individual packages
- **Build orchestration** through Turborepo pipelines

---

## 📱 **Applications (`apps/`)**

Applications are **deployable units** that consume shared packages and provide user-facing functionality.

### 🌐 **`apps/web/` - Next.js Frontend**

**Purpose:** Main user interface for the Conduit application
**Technology Stack:**
- **Next.js 14** with App Router and React Server Components
- **TypeScript** with strict configurations
- **Tailwind CSS v4** for styling
- **shadcn/ui** component system (from `@conduit/ui`)
- **tRPC** client for type-safe API communication
- **Zustand** for client-side state management
- **React Hook Form + Zod** for form validation

**Directory Structure:**
```
apps/web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Application-specific components
│   ├── lib/                 # Client-side utilities
│   └── store/               # Zustand state management
├── public/                  # Static assets
├── package.json             # Frontend dependencies
└── next.config.js           # Next.js configuration
```

**Key Dependencies:**
- `@conduit/ui` - Shared component library
- `@conduit/api` - tRPC client types
- `@conduit/utils` - Shared utilities
- `@conduit/config` - Shared configurations

### 🚀 **`apps/api/` - Fastify Backend**

**Purpose:** High-performance API server with type-safe endpoints
**Technology Stack:**
- **Fastify** web framework for high performance
- **tRPC** for type-safe API layer
- **Drizzle ORM** with PostgreSQL database
- **Zod** validation schemas
- **Winston** structured logging
- **JWT** authentication with enhanced security

**Directory Structure:**
```
apps/api/
├── src/
│   ├── routes/              # tRPC routers
│   ├── middleware/          # Fastify middleware
│   ├── plugins/             # Fastify plugins
│   └── index.ts             # Application entry point
├── package.json             # Backend dependencies
└── README.md                # API documentation
```

**Key Dependencies:**
- `@conduit/core` - Business logic and domain models
- `@conduit/database` - Database schemas and migrations
- `@conduit/auth` - Authentication utilities
- `@conduit/utils` - Shared validation and utilities

### 📖 **`apps/docs/` - Storybook Documentation**

**Purpose:** Component documentation and design system showcase
**Technology Stack:**
- **Storybook 7** for component documentation
- **React** for component rendering
- **TypeScript** for type safety

**Directory Structure:**
```
apps/docs/
├── .storybook/             # Storybook configuration
├── stories/                # Component stories
└── package.json            # Documentation dependencies
```

**Key Dependencies:**
- `@conduit/ui` - Components being documented
- `@storybook/*` - Storybook ecosystem

### 🧪 **`apps/e2e/` - End-to-End Testing**

**Purpose:** Comprehensive user journey testing
**Technology Stack:**
- **Cypress** for E2E testing
- **TypeScript** for test scripts

**Directory Structure:**
```
apps/e2e/
├── cypress/
│   ├── e2e/                # Test files
│   ├── fixtures/           # Test data
│   └── support/            # Custom commands
└── package.json            # Testing dependencies
```

---

## 📦 **Shared Packages (`packages/`)**

Shared packages contain **reusable code** that can be consumed by applications and other packages.

### 🎨 **`packages/ui/` - Component Library**

**Purpose:** Shared React components based on shadcn/ui
**Technology Stack:**
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** primitives
- **Class Variance Authority** for component variants

**Directory Structure:**
```
packages/ui/
├── src/
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   └── index.ts             # Package exports
├── package.json             # UI dependencies
└── tsconfig.json            # TypeScript configuration
```

**Components Include:**
- Button, Card, Input, Form components
- Typography and layout components
- Custom hooks and utilities

### 🔌 **`packages/api/` - tRPC Definitions**

**Purpose:** Type-safe API contracts and client/server types
**Technology Stack:**
- **tRPC** for type-safe APIs
- **Zod** for runtime validation
- **TypeScript** for compile-time safety

**Directory Structure:**
```
packages/api/
├── src/
│   ├── routers/            # tRPC router definitions
│   ├── types/              # Shared API types
│   └── index.ts            # Package exports
└── package.json            # API dependencies
```

**Exports:**
- tRPC router types and interfaces
- Request/response schemas
- API client configuration

### 🗄️ **`packages/database/` - Data Layer**

**Purpose:** Database schemas, migrations, and ORM configuration
**Technology Stack:**
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** as the primary database
- **Zod** for schema validation

**Directory Structure:**
```
packages/database/
├── src/
│   ├── schema/             # Database schema definitions
│   ├── migrations/         # Database migrations
│   ├── queries/            # Reusable queries
│   └── index.ts            # Package exports
└── package.json            # Database dependencies
```

### 🏛️ **`packages/core/` - Business Logic**

**Purpose:** Domain models, use cases, and business rules
**Technology Stack:**
- **TypeScript** for type safety
- **Zod** for domain validation
- **Clean Architecture** patterns

**Directory Structure:**
```
packages/core/
├── src/
│   ├── types/              # Domain types and interfaces
│   ├── models/             # Domain models (future)
│   ├── use-cases/          # Business use cases (future)
│   ├── services/           # Domain services (future)
│   └── index.ts            # Package exports
└── package.json            # Core dependencies
```

**Current Implementation:**
- Core domain types (User, Article, Comment)
- Ready for business logic expansion

### 🔐 **`packages/auth/` - Authentication**

**Purpose:** Authentication utilities and middleware
**Technology Stack:**
- **JWT** for token management
- **bcrypt** for password hashing
- **TypeScript** for type safety

**Directory Structure:**
```
packages/auth/
├── src/                    # Authentication logic
└── package.json            # Auth dependencies
```

### ⚙️ **`packages/config/` - Shared Configurations**

**Purpose:** Shared configurations for build tools and linting
**Technology Stack:**
- **ESLint** configurations
- **Prettier** configurations
- **TypeScript** configurations

**Directory Structure:**
```
packages/config/
├── eslint/                 # ESLint configurations
├── prettier/               # Prettier configurations
├── typescript/             # TypeScript configurations
└── package.json            # Config dependencies
```

### 🛠️ **`packages/utils/` - Utilities**

**Purpose:** Shared utility functions and validation schemas
**Technology Stack:**
- **Zod** for validation
- **TypeScript** for utilities
- **Jest** for testing

**Directory Structure:**
```
packages/utils/
├── src/
│   ├── validation/         # Zod validation schemas
│   ├── error/              # Error handling utilities
│   ├── logger/             # Logging utilities
│   └── index.ts            # Package exports
└── package.json            # Utils dependencies
```

---

## 🔧 **Development Tools (`tools/`)**

Tools directory contains **build tools, scripts, and generators** for development productivity.

### 🏗️ **`tools/build/`**
- Custom build configurations
- Turborepo optimizations
- Deployment scripts

### 📝 **`tools/scripts/`**
- Database management scripts
- Environment setup utilities
- CI/CD helper scripts

### ⚡ **`tools/generators/`**
- Component generation templates
- Package scaffolding tools
- API endpoint generators

---

## 📚 **Documentation (`docs/`)**

Centralized documentation following Google's standards.

### 🏛️ **`docs/architecture/`**
- System architecture diagrams
- Design patterns documentation
- Component interaction flows

### 📡 **`docs/api/`**
- tRPC endpoint documentation
- Authentication flows
- API usage examples

### 📖 **`docs/guides/`**
- Development setup guides
- Coding standards
- Testing strategies

### 📋 **`docs/adr/`**
- Architecture Decision Records
- Technology choices rationale
- Migration plans

---

## 🏗️ **Infrastructure (`infrastructure/`)**

Infrastructure as Code following enterprise practices.

### 🐳 **`infrastructure/docker/`**
- Application Dockerfiles
- Docker Compose configurations
- Multi-stage build optimizations

### ☸️ **`infrastructure/k8s/`**
- Kubernetes deployment manifests
- Service definitions
- ConfigMaps and Secrets

### 🌍 **`infrastructure/terraform/`**
- Cloud resource definitions
- Network and security configurations
- Database provisioning

---

## 🔄 **Development Workflow**

### **Package Dependencies Flow**
```
apps/web → packages/ui, api, utils, config
apps/api → packages/core, database, auth, utils
apps/docs → packages/ui
apps/e2e → (tests all apps)
```

### **Build Pipeline**
1. **Install** - Single yarn install at root
2. **Build** - Turborepo orchestrates package builds
3. **Test** - Jest for units, Cypress for E2E
4. **Lint** - ESLint + Prettier across all packages
5. **Deploy** - Applications deployed independently

### **Development Commands**
```bash
# Root level - affects all workspaces
yarn dev                    # Start all applications
yarn build                  # Build all packages and apps
yarn test                   # Run all tests
yarn lint                   # Lint all code

# Workspace specific
yarn workspace @conduit/web dev     # Frontend only
yarn workspace @conduit/api dev     # Backend only
yarn workspace @conduit/docs dev    # Storybook only
```

---

## ⚡ **Technology Decisions**

### **Why Turborepo?**
- **Incremental builds** - Only rebuild what changed
- **Remote caching** - Share build artifacts across team
- **Task orchestration** - Parallel execution of independent tasks
- **Enterprise proven** - Used by Vercel, Netflix, and others

### **Why tRPC?**
- **End-to-end type safety** - Shared types between client/server
- **No code generation** - Direct TypeScript inference
- **Performance** - Efficient serialization and caching
- **Developer experience** - Excellent IDE support

### **Why Drizzle ORM?**
- **Type safety** - SQL-like syntax with TypeScript
- **Performance** - Minimal runtime overhead
- **Migrations** - Version-controlled database changes
- **Flexibility** - Raw SQL when needed

### **Why Zod?**
- **Runtime validation** - Ensures data integrity
- **TypeScript integration** - Infer types from schemas
- **Composability** - Build complex schemas from simple ones
- **Error handling** - Detailed validation errors

---

## 📋 **Development Guidelines**

### **Adding New Features**
1. **Identify the layer** - UI, API, business logic, or data
2. **Choose the right package** - Follow separation of concerns
3. **Update dependencies** - Add workspace references as needed
4. **Write tests** - Unit tests for packages, E2E for features
5. **Document changes** - Update relevant documentation

### **Package Creation**
1. Create directory in appropriate location (`apps/` or `packages/`)
2. Add `package.json` with proper name (`@conduit/package-name`)
3. Configure TypeScript with shared configs
4. Add to root workspace in `package.json`
5. Update Turborepo pipelines if needed

### **Naming Conventions**
- **Applications:** `@conduit/app-name` (e.g., `@conduit/web`)
- **Packages:** `@conduit/package-name` (e.g., `@conduit/ui`)
- **Files:** kebab-case for files, PascalCase for components
- **Directories:** kebab-case consistently

---

**This document serves as the single source of truth for project organization and should be updated as the project evolves.** 