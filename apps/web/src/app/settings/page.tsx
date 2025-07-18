'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Form, FormField, FormLabel, FormMessage, Input, Textarea, Avatar } from '@conduit/ui'
import { useAuthStore } from '@/store/auth'

const settingsFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const { data: session } = useSession()
  const { user, setUser, logout } = useAuthStore()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
  })

  const watchedImage = watch('image')

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        image: user.image || '',
        password: '',
      })
    }
  }, [user, reset])

  // Redirect if not authenticated
  useEffect(() => {
    if (!session && !user) {
      router.push('/login')
    }
  }, [session, user, router])

  async function onSubmit(values: SettingsFormValues) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // TODO: Replace with actual tRPC call when server is ready
      // const result = await trpc.auth.updateUser.mutate({
      //   user: {
      //     email: values.email,
      //     username: values.username,
      //     bio: values.bio,
      //     image: values.image,
      //     ...(values.password && { password: values.password })
      //   }
      // })

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful update
      const updatedUser = {
        ...user!,
        email: values.email,
        username: values.username,
        bio: values.bio || null,
        image: values.image || null,
      }

      setUser(updatedUser)
      setSuccess('Profile updated successfully!')
      
      // Clear password field after successful update
      reset({
        ...values,
        password: '',
      })
    } catch (err) {
      console.error('Settings update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await signOut({ redirect: false })
      logout()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!session && !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Settings</CardTitle>
          <CardDescription>
            Update your profile information and account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Profile Picture Preview */}
            <div className="flex items-center space-x-4 mb-6">
              <Avatar
                src={watchedImage}
                alt={user?.username}
                fallback={user?.username?.[0]}
                size="lg"
              />
              <div>
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-gray-600">Enter a URL for your profile image</p>
              </div>
            </div>

            <FormField>
              <FormLabel htmlFor="image">Profile Image URL</FormLabel>
              <Input
                id="image"
                {...register('image')}
                placeholder="https://example.com/your-image.jpg"
                disabled={isLoading}
              />
              {errors.image && (
                <FormMessage>{errors.image.message}</FormMessage>
              )}
            </FormField>

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
              <FormLabel htmlFor="bio">Bio</FormLabel>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Tell us about yourself..."
                disabled={isLoading}
                rows={4}
              />
              {errors.bio && (
                <FormMessage>{errors.bio.message}</FormMessage>
              )}
            </FormField>

            <FormField>
              <FormLabel htmlFor="password">New Password</FormLabel>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter new password (leave empty to keep current)"
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

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Settings'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </Form>

          {/* Logout Section */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-600">Logout</h3>
                <p className="text-sm text-gray-600">Sign out of your account</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 