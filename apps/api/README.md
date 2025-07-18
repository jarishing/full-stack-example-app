# 🚀 Conduit API

Fastify backend API server for the Conduit Portfolio project.

## Features

- **tRPC** - Type-safe API with end-to-end type safety
- **Fastify** - High-performance web framework
- **Drizzle ORM** - Type-safe database operations
- **JWT Authentication** - Secure authentication system
- **Zod Validation** - Runtime type validation

## Development

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Run tests
yarn test

# Type checking
yarn type-check
```

## API Structure

- `/api/trpc` - tRPC router endpoints
- `/api/auth` - Authentication endpoints
- `/api/health` - Health check endpoint

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/conduit
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3001
``` 