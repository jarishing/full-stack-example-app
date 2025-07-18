"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle, Form, FormField, FormLabel, FormMessage } from "@conduit/ui"

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError("")

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  disabled={isLoading}
                  {...form.register("email")}
                />
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormField>
              
              <FormField>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  {...form.register("password")}
                />
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormField>

              {error && (
                <FormMessage>{error}</FormMessage>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </Form>

            <div className="text-center text-sm mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 