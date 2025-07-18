"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@conduit/ui"

export function Navigation() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">conduit</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Home
            </Link>
            {session && (
              <>
                <Link
                  href="/articles"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Articles
                </Link>
                <Link
                  href="/editor"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  New Article
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {status === "loading" ? (
              <div>Loading...</div>
            ) : session ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">
                    {(session.user as any)?.username || session.user?.name}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
} 