'use client'

import { useState } from 'react'

interface User {
  id: string
  email: string
  username: string
  bio: string | null
  image: string | null
}

interface AuthResult {
  user: User
  token: string
}

export default function TrpcDemoPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)

  const clearState = () => {
    setResult(null)
    setError(null)
  }

  const callTrpcEndpoint = async (procedure: string, input: any = null, method: 'GET' | 'POST' = 'POST') => {
    setLoading(true)
    clearState()
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      // Add auth header if we have a token
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }
      
      const config: RequestInit = {
        method,
        headers,
      }
      
      if (method === 'POST' && input) {
        config.body = JSON.stringify(input)
      }
      
      const response = await fetch(`http://localhost:4000/trpc/${procedure}`, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`)
      }
      
      setResult(data)
      
      // If this was a login/register, save the token
      if (data.result?.data?.token) {
        setAuthToken(data.result.data.token)
      }
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testRegister = () => {
    const timestamp = Date.now()
    callTrpcEndpoint('auth.register', {
      email: `user${timestamp}@example.com`,
      username: `user${timestamp}`,
      password: 'password123'
    })
  }

  const testLogin = () => {
    // Use the last registered user if available
    if (result?.result?.data?.user?.email) {
      callTrpcEndpoint('auth.login', {
        email: result.result.data.user.email,
        password: 'password123'
      })
    } else {
      setError('Register a user first to test login')
    }
  }

  const testGetCurrentUser = () => {
    if (!authToken) {
      setError('Login first to test protected endpoints')
      return
    }
    callTrpcEndpoint('auth.me', null, 'GET')
  }

  const testCreateArticle = () => {
    if (!authToken) {
      setError('Login first to create articles')
      return
    }
    
    const timestamp = Date.now()
    callTrpcEndpoint('articles.create', {
      title: `My Article ${timestamp}`,
      description: 'This is a test article created from the frontend',
      body: 'Here is the full content of the article. It demonstrates the full-stack tRPC integration working perfectly!',
      tagList: ['test', 'demo', 'trpc']
    })
  }

  const testGetArticles = () => {
    callTrpcEndpoint('articles.list', { limit: 5, offset: 0 }, 'GET')
  }

  const testHealthCheck = () => {
    callTrpcEndpoint('health', null, 'GET')
  }

  const testGetComments = () => {
    // Use the last created article's slug if available
    const articleSlug = result?.result?.data?.article?.slug
    if (!articleSlug) {
      setError('Create an article first to test comments')
      return
    }
    callTrpcEndpoint('comments.list', { slug: articleSlug }, 'GET')
  }

  const testCreateComment = () => {
    if (!authToken) {
      setError('Login first to create comments')
      return
    }
    
    const articleSlug = result?.result?.data?.article?.slug
    if (!articleSlug) {
      setError('Create an article first to add comments')
      return
    }
    
    callTrpcEndpoint('comments.create', {
      slug: articleSlug,
      body: 'This is a test comment! The tRPC integration is working perfectly with comments now!'
    })
  }

  const testFavoriteArticle = () => {
    if (!authToken) {
      setError('Login first to favorite articles')
      return
    }
    
    const articleSlug = result?.result?.data?.article?.slug
    if (!articleSlug) {
      setError('Create an article first to favorite it')
      return
    }
    
    callTrpcEndpoint('favorites.create', { slug: articleSlug })
  }

  const testUnfavoriteArticle = () => {
    if (!authToken) {
      setError('Login first to unfavorite articles')
      return
    }
    
    const articleSlug = result?.result?.data?.article?.slug
    if (!articleSlug) {
      setError('Create and favorite an article first')
      return
    }
    
    callTrpcEndpoint('favorites.delete', { slug: articleSlug })
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🚀 tRPC Full-Stack Demo</h1>
      
      {authToken && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ <strong>Authenticated!</strong> Token: {authToken.substring(0, 20)}...
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Authentication Tests */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">🔐 Authentication</h2>
          
          <button
            onClick={testRegister}
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Register New User'}
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Login User'}
          </button>
          
          <button
            onClick={testGetCurrentUser}
            disabled={loading}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Get Current User (Protected)'}
          </button>
        </div>
        
        {/* Article Tests */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">📝 Articles</h2>
          
          <button
            onClick={testCreateArticle}
            disabled={loading}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Create Article (Protected)'}
          </button>
          
          <button
            onClick={testGetArticles}
            disabled={loading}
            className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Get All Articles'}
          </button>
          
          <button
            onClick={testHealthCheck}
            disabled={loading}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Health Check'}
          </button>
        </div>
        
        {/* Comments Tests */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">💬 Comments & Favorites</h2>
          
          <button
            onClick={testCreateComment}
            disabled={loading}
            className="w-full bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Add Comment (Protected)'}
          </button>
          
          <button
            onClick={testGetComments}
            disabled={loading}
            className="w-full bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Get Comments'}
          </button>
          
          <button
            onClick={testFavoriteArticle}
            disabled={loading}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Favorite Article ❤️'}
          </button>
          
          <button
            onClick={testUnfavoriteArticle}
            disabled={loading}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Unfavorite Article 💔'}
          </button>
        </div>
      </div>
      
      {/* Results Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>❌ Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="mb-4 p-4 bg-gray-100 border rounded">
          <strong>✅ Success:</strong>
          <pre className="mt-2 text-sm overflow-auto max-h-96 bg-white p-2 rounded border">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">🎯 Testing Flow:</h3>
        <ol className="list-decimal list-inside text-blue-700 space-y-1">
          <li>Start with <strong>Register New User</strong> to create a new account</li>
          <li>Then <strong>Login User</strong> to get an authentication token</li>
          <li>Try <strong>Get Current User</strong> to test protected endpoints</li>
          <li>Use <strong>Create Article</strong> to test write operations</li>
          <li>Check <strong>Get All Articles</strong> to see your created content</li>
          <li>Test <strong>Add Comment</strong> to add comments to your article</li>
          <li>Use <strong>Get Comments</strong> to see all comments on the article</li>
          <li>Try <strong>Favorite Article ❤️</strong> to mark the article as favorite</li>
          <li>Test <strong>Unfavorite Article 💔</strong> to remove from favorites</li>
        </ol>
      </div>
    </div>
  )
} 