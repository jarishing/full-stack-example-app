# 🔧 Build & Development Tools

This directory contains build tools, scripts, and utilities for the Conduit Portfolio monorepo.

## Structure

- **`build/`** - Build configurations and custom build tools
- **`scripts/`** - Development and maintenance scripts
- **`generators/`** - Code generation templates and tools

## Available Tools

### Build Tools (`build/`)
- Custom Turborepo configurations
- Build optimization scripts
- Deployment preparation tools

### Scripts (`scripts/`)
- Database management scripts
- Environment setup utilities
- CI/CD helper scripts

### Generators (`generators/`)
- Component generation templates
- Package scaffolding tools
- API endpoint generators

## Usage

Run tools from the project root:

```bash
# Database reset
yarn tools:db:reset

# Generate new component
yarn tools:generate:component MyComponent

# Setup development environment
yarn tools:setup:env
```

## Contributing

- Add new tools to the appropriate subdirectory
- Document tool usage in this README
- Follow the established naming conventions
- Test tools thoroughly before committing 