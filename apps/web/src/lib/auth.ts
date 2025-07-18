import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { User } from '@conduit/api-types'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // TODO: Replace with actual API call to your backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: {
                email: credentials.email,
                password: credentials.password,
              },
            }),
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()
          const user = data.user

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.username,
              image: user.image,
              username: user.username,
              bio: user.bio,
              token: user.token,
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist additional user information to the token
      if (user) {
        token.username = (user as any).username
        token.bio = (user as any).bio
        token.apiToken = (user as any).token
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        (session.user as any).id = token.sub!
        ;(session.user as any).username = token.username
        ;(session.user as any).bio = token.bio
        ;(session.user as any).token = token.apiToken
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
} 