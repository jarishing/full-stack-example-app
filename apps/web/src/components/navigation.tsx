'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface User {
  username: string
  email: string
  bio?: string
  image?: string
}

export function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch('http://localhost:4000/trpc/auth.me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.result?.data?.user) {
          setUser(data.result.data.user)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-green-500">
            conduit
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            
            {!isLoading && (
              <>
                {user ? (
                  // Authenticated user navigation
                  <>
                    <Link href="/editor" className="text-gray-700 hover:text-gray-900">
                      <span className="mr-1">✏️</span>
                      New Article
                    </Link>
                    <Link href="/settings" className="text-gray-700 hover:text-gray-900">
                      <span className="mr-1">⚙️</span>
                      Settings
                    </Link>
                    <Link 
                      href={`/profile/${user.username}`} 
                      className="flex items-center text-gray-700 hover:text-gray-900"
                    >
                      <img
                        src={user.image || `https://api.realworld.io/images/smiley-cyrus.jpeg`}
                        alt={user.username}
                        className="w-6 h-6 rounded-full mr-1"
                      />
                      {user.username}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  // Guest navigation
                  <>
                    <Link href="/login" className="text-gray-700 hover:text-gray-900">
                      Sign in
                    </Link>
                    <Link href="/register" className="text-gray-700 hover:text-gray-900 border border-gray-300 px-3 py-1 rounded">
                      Sign up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 