import dotenv from 'dotenv'
import path from 'path'

// Load .env from project root (two levels up from apps/api/src)
dotenv.config({ path: path.join(__dirname, '../../../.env') })

import Fastify from 'fastify'
import cors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { appRouter } from './router/index'
import { createContext } from './context'

console.log('Environment check - DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')

const server = Fastify({
  maxParamLength: 5000,
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  },
})

// Register CORS
server.register(cors, {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your domain
    : ['http://localhost:3000'],
  credentials: true,
})

// Register tRPC
server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { 
    router: appRouter, 
    createContext,
  },
})

// Health check endpoint
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000
    await server.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 tRPC Server ready at http://localhost:${port}`)
    console.log(`📡 tRPC endpoint: http://localhost:${port}/trpc`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start() 