import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  target: 'node18',
  sourcemap: true,
  minify: false,
  splitting: false,
  external: [
    // Mark all dependencies as external since this is a Node.js app
    'fastify',
    '@fastify/cors',
    '@fastify/jwt',
    '@trpc/server',
    'bcryptjs',
    'dotenv',
    'drizzle-orm',
    'jsonwebtoken',
    'pg',
    'zod'
  ]
}) 