import Fastify from 'fastify'
import cors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { appRouter } from './router'
import { createContext } from './context'

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
    onError({ path, error }) {
      console.error(`❌ tRPC failed on ${path ?? '<no-path>'}:`, error)
    },
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