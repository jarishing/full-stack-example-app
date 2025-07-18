'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Form, FormField, FormLabel, FormMessage, Input } from '@conduit/ui'
import { useAuthStore } from '@/store/auth'

const registerFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterFormValues = z.infer<typeof registerFormSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  })

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual tRPC call when server is ready
      // const result = await trpc.auth.register.mutate({
      //   user: values
      // })

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful registration
      const mockUser = {
        email: values.email,
        token: 'mock-jwt-token-' + Date.now(),
        username: values.username,
        bio: null,
        image: null,
      }

      setUser(mockUser)
      router.push('/')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                {...register('username')}
                placeholder="Enter your username"
                disabled={isLoading}
              />
              {errors.username && (
                <FormMessage>{errors.username.message}</FormMessage>
              )}
            </FormField>
            
            <FormField>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && (
                <FormMessage>{errors.email.message}</FormMessage>
              )}
            </FormField>

            <FormField>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && (
                <FormMessage>{errors.password.message}</FormMessage>
              )}
            </FormField>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 