'use client'

import { useState } from 'react'

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:4000/trpc/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testRegister = async () => {
    setLoading(true)
    setError(null)

    
  // generate a username and force it to ≤20 chars
  const raw = `testuser${Date.now()}`;
  const username = raw.slice(0, 20);

    try {
      const response = await fetch('http://localhost:4000/trpc/auth.register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          username: username,
          password: 'password123'
        }),
      })
      
      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Health Endpoint'}
        </button>
        
        <button
          onClick={testRegister}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          {loading ? 'Testing...' : 'Test Registration'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 border rounded">
          <strong>Result:</strong>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 