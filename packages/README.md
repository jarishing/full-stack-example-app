# 📦 Shared Packages

This directory contains all shared libraries and utilities used across the Conduit Portfolio monorepo.

## Structure

- **`ui/`** - shadcn/ui component system
- **`api/`** - tRPC definitions and types
- **`database/`** - Drizzle ORM schemas and migrations
- **`core/`** - Business logic and domain models
- **`auth/`** - Authentication utilities and middleware
- **`config/`** - Shared configurations
- **`utils/`** - Utility functions and validation schemas

## Usage

Import packages using workspace syntax:

```typescript
import { Button } from '@conduit/ui'
import { UserSchema } from '@conduit/database'
import { validateEmail } from '@conduit/utils'
```

## Guidelines

- Each package should have a single responsibility
- Export types and runtime code appropriately
- Maintain backwards compatibility when possible
- Document public APIs thoroughly
- Follow semantic versioning principles 