'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { Button, Card, CardContent, CardHeader, Form, FormField, FormLabel, FormMessage, Textarea, Avatar } from '@conduit/ui'
import { useAuthStore } from '@/store/auth'
import type { Article, Comment } from '@conduit/api-types'

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { data: session } = useSession()
  const { user } = useAuthStore()
  
  const [article, setArticle] = useState<Article | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isCommentLoading, setIsCommentLoading] = useState(false)

  const isAuthor = user?.username === article?.author.username

  useEffect(() => {
    loadArticle()
    loadComments()
  }, [slug])

  async function loadArticle() {
    setIsLoading(true)
    try {
      // TODO: Replace with actual tRPC call when server is ready
      // const result = await trpc.articles.getArticle.query({ slug })

      // Mock article data
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockArticle: Article = {
        slug,
        title: 'How to Build Scalable Web Applications with Next.js and TypeScript',
        description: 'Learn the best practices for building enterprise-grade applications with modern frameworks.',
        body: `# Building Scalable Web Applications

## Introduction

In this comprehensive guide, we'll explore how to build scalable web applications using Next.js and TypeScript. We'll cover everything from project setup to deployment strategies.

## Project Architecture

When building large-scale applications, architecture is crucial. Here are the key principles:

### 1. Component Organization
- Create reusable UI components
- Implement proper separation of concerns
- Use TypeScript for type safety

### 2. State Management
- Choose the right state management solution
- Implement proper data flow patterns
- Handle side effects efficiently

### 3. Performance Optimization
- Implement code splitting
- Optimize bundle sizes
- Use proper caching strategies

## Best Practices

Here are some essential best practices to follow:

1. **Type Safety**: Use TypeScript throughout your application
2. **Testing**: Implement comprehensive test coverage
3. **Documentation**: Maintain clear and up-to-date documentation
4. **Security**: Follow security best practices
5. **Performance**: Monitor and optimize application performance

## Conclusion

Building scalable web applications requires careful planning and adherence to best practices. By following the guidelines in this article, you'll be well-equipped to create robust, maintainable applications.

Happy coding! 🚀`,
        tagList: ['javascript', 'react', 'nextjs', 'typescript', 'web-development'],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        favorited: Math.random() > 0.5,
        favoritesCount: Math.floor(Math.random() * 100) + 10,
        author: {
          username: 'tech_writer',
          bio: 'Senior software engineer and technical writer with 10+ years of experience.',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
          following: Math.random() > 0.5,
        },
      }

      setArticle(mockArticle)
    } catch (error) {
      console.error('Failed to load article:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadComments() {
    try {
      // TODO: Replace with actual tRPC call when server is ready
      // const result = await trpc.comments.getComments.query({ slug })

      // Mock comments data
      const mockComments: Comment[] = [
        {
          id: 1,
          body: 'Great article! This really helped me understand the concepts better.',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          author: {
            username: 'jane_doe',
            bio: 'Frontend developer',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=400&h=400&fit=crop&crop=face',
            following: false,
          },
        },
        {
          id: 2,
          body: 'Thanks for sharing this. The architecture section was particularly helpful.',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          author: {
            username: 'dev_guru',
            bio: 'Full stack developer',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            following: true,
          },
        },
      ]

      setComments(mockComments)
    } catch (error) {
      console.error('Failed to load comments:', error)
    }
  }

  async function handleFavoriteToggle() {
    if (!article || !session) return

    try {
      // TODO: Replace with actual tRPC call when server is ready
      // if (article.favorited) {
      //   await trpc.articles.unfavoriteArticle.mutate({ slug })
      // } else {
      //   await trpc.articles.favoriteArticle.mutate({ slug })
      // }

      setArticle(prev => prev ? {
        ...prev,
        favorited: !prev.favorited,
        favoritesCount: prev.favorited ? prev.favoritesCount - 1 : prev.favoritesCount + 1,
      } : null)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  async function handleFollowToggle() {
    if (!article || !session) return

    setIsFollowLoading(true)
    try {
      // TODO: Replace with actual tRPC call when server is ready
      // if (article.author.following) {
      //   await trpc.profiles.unfollowUser.mutate({ username: article.author.username })
      // } else {
      //   await trpc.profiles.followUser.mutate({ username: article.author.username })
      // }

      setArticle(prev => prev ? {
        ...prev,
        author: {
          ...prev.author,
          following: !prev.author.following,
        },
      } : null)
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    } finally {
      setIsFollowLoading(false)
    }
  }

  async function handleDeleteArticle() {
    if (!article || !confirm('Are you sure you want to delete this article?')) return

    try {
      // TODO: Replace with actual tRPC call when server is ready
      // await trpc.articles.deleteArticle.mutate({ slug })
      
      router.push('/')
    } catch (error) {
      console.error('Failed to delete article:', error)
    }
  }

  async function handleAddComment() {
    if (!newComment.trim() || !session) return

    setIsCommentLoading(true)
    try {
      // TODO: Replace with actual tRPC call when server is ready
      // const result = await trpc.comments.createComment.mutate({
      //   slug,
      //   comment: { body: newComment }
      // })

      // Mock comment creation
      const mockComment: Comment = {
        id: Date.now(),
        body: newComment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          username: user?.username || 'current_user',
          bio: user?.bio || 'User bio',
          image: user?.image || null,
          following: false,
        },
      }

      setComments(prev => [mockComment, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsCommentLoading(false)
    }
  }

  async function handleDeleteComment(commentId: number) {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      // TODO: Replace with actual tRPC call when server is ready
      // await trpc.comments.deleteComment.mutate({ slug, id: commentId })

      setComments(prev => prev.filter(comment => comment.id !== commentId))
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-3/4"></div>
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600">Article not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Article Header */}
      <div className="bg-gray-900 text-white px-8 py-12 rounded-t-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar
              src={article.author.image}
              alt={article.author.username}
              fallback={article.author.username[0]}
              size="md"
            />
            <div>
              <Link href={`/profile/${article.author.username}`}>
                <p className="font-medium hover:text-green-400 transition-colors">
                  {article.author.username}
                </p>
              </Link>
              <p className="text-gray-300 text-sm">
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {session && !isAuthor && (
              <Button
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-gray-900"
              >
                {isFollowLoading ? 'Loading...' : article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
              </Button>
            )}
            
            <Button
              onClick={handleFavoriteToggle}
              disabled={!session}
              variant="outline"
              size="sm"
              className={`border-green-500 ${
                article.favorited 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'text-green-400 hover:bg-green-500 hover:text-white'
              }`}
            >
              ♥ Favorite Article ({article.favoritesCount})
            </Button>

            {isAuthor && (
              <div className="flex space-x-2">
                <Button asChild variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-gray-900">
                  <Link href={`/editor/${article.slug}`}>Edit Article</Link>
                </Button>
                <Button 
                  onClick={handleDeleteArticle}
                  variant="outline" 
                  size="sm"
                  className="text-red-400 border-red-400 hover:bg-red-500 hover:text-white"
                >
                  Delete Article
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <Card className="rounded-t-none">
        <CardContent className="p-8">
          {/* Article Body - Using simple markdown-like rendering */}
          <div className="prose max-w-none">
            {article.body.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>
              } else if (line.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>
              } else if (line.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.slice(4)}</h3>
              } else if (line.trim() === '') {
                return <br key={index} />
              } else if (line.match(/^\d+\./)) {
                return <p key={index} className="mb-2 ml-4">{line}</p>
              } else if (line.startsWith('- ')) {
                return <p key={index} className="mb-2 ml-4">• {line.slice(2)}</p>
              } else {
                return <p key={index} className="mb-4 leading-relaxed">{line}</p>
              }
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
            {article.tagList.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>

        {/* Add Comment Form */}
        {session ? (
          <Card className="mb-6">
            <CardContent className="p-6">
              <Form onSubmit={(e) => { e.preventDefault(); handleAddComment(); }}>
                <FormField>
                  <FormLabel htmlFor="comment">Write a comment...</FormLabel>
                  <Textarea
                    id="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    disabled={isCommentLoading}
                  />
                </FormField>
                <div className="flex justify-end mt-4">
                  <Button 
                    type="submit" 
                    disabled={!newComment.trim() || isCommentLoading}
                    size="sm"
                  >
                    {isCommentLoading ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-4">
                <Link href="/login" className="text-green-600 hover:text-green-500">Sign in</Link> or{' '}
                <Link href="/register" className="text-green-600 hover:text-green-500">sign up</Link> to add comments.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar
                        src={comment.author.image}
                        alt={comment.author.username}
                        fallback={comment.author.username[0]}
                        size="sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Link href={`/profile/${comment.author.username}`}>
                            <span className="font-medium hover:text-green-600 transition-colors">
                              {comment.author.username}
                            </span>
                          </Link>
                          <span className="text-gray-500 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{comment.body}</p>
                      </div>
                    </div>
                    {user?.username === comment.author.username && (
                      <Button
                        onClick={() => handleDeleteComment(comment.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 