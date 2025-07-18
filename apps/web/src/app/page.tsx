'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { Button, Card, CardContent, CardHeader, CardTitle, Avatar } from '@conduit/ui'
import { useAuthStore } from '@/store/auth'
import type { Article } from '@conduit/api-types'

export default function HomePage() {
  const { data: session } = useSession()
  const { user } = useAuthStore()
  const [articles, setArticles] = useState<Article[]>([])
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'global' | 'feed'>('global')

  useEffect(() => {
    loadArticles()
    loadPopularTags()
  }, [activeTab])

  async function loadArticles() {
    setIsLoading(true)
    try {
      // TODO: Replace with actual tRPC calls when server is ready
      // const result = activeTab === 'feed' 
      //   ? await trpc.articles.getFeed.query({ limit: 10 })
      //   : await trpc.articles.getArticles.query({ limit: 10 })

      // Mock articles data
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockArticles: Article[] = Array.from({ length: 5 }, (_, i) => ({
        slug: `sample-article-${i + 1}`,
        title: `How to Build Modern Web Applications ${i + 1}`,
        description: `Learn the latest techniques and best practices for building scalable web applications with modern frameworks and tools.`,
        body: 'Article content here...',
        tagList: ['javascript', 'react', 'nextjs', 'typescript'].slice(0, Math.floor(Math.random() * 3) + 1),
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        favorited: Math.random() > 0.5,
        favoritesCount: Math.floor(Math.random() * 50),
        author: {
          username: ['john_doe', 'jane_smith', 'dev_guru', 'tech_writer'][Math.floor(Math.random() * 4)],
          bio: 'Software developer and tech writer',
          image: `https://images.unsplash.com/photo-${1472099645785 + i}?w=400&h=400&fit=crop&crop=face`,
          following: Math.random() > 0.5,
        },
      }))

      setArticles(mockArticles)
    } catch (error) {
      console.error('Failed to load articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadPopularTags() {
    try {
      // TODO: Replace with actual tRPC call when server is ready
      // const result = await trpc.tags.getTags.query()
      
      // Mock popular tags
      const mockTags = [
        'javascript', 'react', 'nextjs', 'typescript', 'nodejs',
        'css', 'html', 'vue', 'angular', 'python', 'golang', 'rust'
      ]
      setPopularTags(mockTags)
    } catch (error) {
      console.error('Failed to load tags:', error)
    }
  }

  async function handleFavoriteToggle(slug: string) {
    try {
      // TODO: Replace with actual tRPC call when server is ready
      // const article = articles.find(a => a.slug === slug)
      // if (article?.favorited) {
      //   await trpc.articles.unfavoriteArticle.mutate({ slug })
      // } else {
      //   await trpc.articles.favoriteArticle.mutate({ slug })
      // }

      // Mock favorite toggle
      setArticles(prev => prev.map(article => 
        article.slug === slug 
          ? { 
              ...article, 
              favorited: !article.favorited,
              favoritesCount: article.favorited 
                ? article.favoritesCount - 1 
                : article.favoritesCount + 1
            }
          : article
      ))
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Hero Section */}
          {!session && !user && (
            <div className="bg-green-500 text-white text-center py-16 mb-8 rounded-lg">
              <h1 className="text-4xl font-bold mb-4">conduit</h1>
              <p className="text-xl mb-6">A place to share your knowledge.</p>
              <div className="space-x-4">
                <Button asChild variant="secondary">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" className="text-white border-white hover:bg-white hover:text-green-500">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Feed Tabs */}
          <div className="border-b mb-6">
            <nav className="flex space-x-8">
              {(session || user) && (
                <button
                  onClick={() => setActiveTab('feed')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'feed'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Your Feed
                </button>
              )}
              <button
                onClick={() => setActiveTab('global')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'global'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Global Feed
              </button>
            </nav>
          </div>

          {/* Articles */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
                      <div className="flex space-x-2">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : articles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No articles yet.
              </div>
            ) : (
              articles.map((article) => (
                <Card key={article.slug}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar
                            src={article.author.image}
                            alt={article.author.username}
                            fallback={article.author.username[0]}
                            size="sm"
                          />
                          <Link href={`/profile/${article.author.username}`}>
                            <span className="font-medium hover:text-green-600 transition-colors">
                              {article.author.username}
                            </span>
                          </Link>
                          <span className="text-gray-500 text-sm">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <Link href={`/article/${article.slug}`}>
                          <h3 className="text-xl font-bold mb-2 hover:text-green-600 transition-colors">
                            {article.title}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 mb-4">{article.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <Link href={`/article/${article.slug}`}>
                            <span className="text-gray-400 text-sm hover:text-gray-600">
                              Read more...
                            </span>
                          </Link>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex flex-wrap gap-1">
                              {article.tagList.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFavoriteToggle(article.slug)}
                              className={article.favorited 
                                ? "text-green-600 border-green-600 bg-green-50" 
                                : "text-green-600 border-green-600 hover:bg-green-50"
                              }
                            >
                              ♥ {article.favoritesCount}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 