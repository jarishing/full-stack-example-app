'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'

interface Article {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: {
    username: string
    bio: string | null
    image: string | null
  }
}

interface ArticlesResponse {
  articles: Article[]
  articlesCount: number
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'global' | 'feed'>('global')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    fetchArticles()
    fetchTags()
  }, [activeTab, selectedTag])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const endpoint = activeTab === 'feed' ? 'articles.feed' : 'articles.list'
      const params = selectedTag ? `?tag=${selectedTag}` : ''
      
      const response = await fetch(`http://localhost:4000/trpc/${endpoint}${params}`)
      const data = await response.json()
      
      if (data.result?.data?.articles) {
        setArticles(data.result.data.articles)
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await fetch('http://localhost:4000/trpc/tags.popular')
      const data = await response.json()
      
      if (data.result?.data?.tags) {
        setTags(data.result.data.tags)
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-green-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">conduit</h1>
          <p className="text-xl opacity-90">A place to share your knowledge.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Articles Section */}
          <div className="lg:col-span-3">
            {/* Feed Toggle */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex">
                <button
                  onClick={() => {
                    setActiveTab('global')
                    setSelectedTag(null)
                  }}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${
                    activeTab === 'global' && !selectedTag
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Global Feed
                </button>
                <button
                  onClick={() => {
                    setActiveTab('feed')
                    setSelectedTag(null)
                  }}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${
                    activeTab === 'feed' && !selectedTag
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Your Feed
                </button>
                {selectedTag && (
                  <button
                    className="px-4 py-2 border-b-2 border-green-500 text-green-600 font-medium text-sm"
                  >
                    # {selectedTag}
                  </button>
                )}
              </div>
            </div>

            {/* Articles List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading articles...</div>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No articles are here... yet.</div>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article) => (
                  <div key={article.slug} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <img
                          src={article.author.image || `https://api.realworld.io/images/smiley-cyrus.jpeg`}
                          alt={article.author.username}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <Link 
                            href={`/profile/${article.author.username}`}
                            className="text-green-500 font-medium hover:underline"
                          >
                            {article.author.username}
                          </Link>
                          <div className="text-gray-400 text-sm">
                            {formatDate(article.createdAt)}
                          </div>
                        </div>
                      </div>
                      <button className="text-green-500 border border-green-500 px-2 py-1 rounded text-sm hover:bg-green-500 hover:text-white">
                        <span className="mr-1">❤️</span>
                        {article.favoritesCount}
                      </button>
                    </div>
                    
                    <Link href={`/article/${article.slug}`} className="block hover:no-underline">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-gray-700">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 mb-3">
                        {article.description}
                      </p>
                    </Link>
                    
                    <div className="flex items-center justify-between">
                      <Link 
                        href={`/article/${article.slug}`}
                        className="text-gray-400 text-sm hover:text-gray-600"
                      >
                        Read more...
                      </Link>
                      <div className="flex flex-wrap gap-1">
                        {article.tagList.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full cursor-pointer hover:bg-gray-300"
                            onClick={() => setSelectedTag(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-100 rounded p-4">
              <h3 className="font-medium text-gray-900 mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 