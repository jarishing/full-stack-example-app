# 📱 Applications

This directory contains all deployable applications in the Conduit Portfolio monorepo.

## Structure

- **`web/`** - Next.js 14 frontend application
- **`api/`** - Fastify backend API server
- **`docs/`** - Storybook documentation site
- **`e2e/`** - Cypress end-to-end testing suite

## Development

Each application can be run independently:

```bash
# Frontend
yarn workspace @conduit/web dev

# Backend API
yarn workspace @conduit/api dev

# Documentation
yarn workspace @conduit/docs dev

# E2E Tests
yarn workspace @conduit/e2e dev
```

## Guidelines

- Each app should be independently deployable
- Shared logic belongs in `packages/`
- Follow the established naming conventions
- Maintain consistent configuration across apps 