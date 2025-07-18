'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Form, FormField, FormLabel, FormMessage, Input, Textarea } from '@conduit/ui'
import { useAuthStore } from '@/store/auth'
import type { Article } from '@conduit/api-types'

const articleFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  body: z.string().min(1, 'Article body is required'),
  tags: z.string().optional(),
})

type ArticleFormValues = z.infer<typeof articleFormSchema>

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug?.[0] // Optional slug for editing
  const { data: session } = useSession()
  const { user } = useAuthStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingArticle, setIsLoadingArticle] = useState(!!slug)
  const [error, setError] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const isEditing = !!slug

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: '',
      description: '',
      body: '',
      tags: '',
    },
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!session && !user) {
      router.push('/login')
    }
  }, [session, user, router])

  // Load article for editing
  useEffect(() => {
    if (slug && (session || user)) {
      loadArticle()
    }
  }, [slug, session, user])

  async function loadArticle() {
    if (!slug) return

    setIsLoadingArticle(true)
    try {
      // TODO: Replace with actual tRPC call when server is ready
      // const result = await trpc.articles.getArticle.query({ slug })

      // Mock article data for editing
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
        favorited: false,
        favoritesCount: 42,
        author: {
          username: user?.username || 'current_user',
          bio: user?.bio || 'User bio',
          image: user?.image || null,
          following: false,
        },
      }

      // Check if user is the author
      if (mockArticle.author.username !== user?.username) {
        setError('You can only edit your own articles.')
        return
      }

      reset({
        title: mockArticle.title,
        description: mockArticle.description,
        body: mockArticle.body,
      })
      setTags(mockArticle.tagList)
    } catch (err) {
      console.error('Failed to load article:', err)
      setError('Failed to load article for editing.')
    } finally {
      setIsLoadingArticle(false)
    }
  }

  async function onSubmit(values: ArticleFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const articleData = {
        title: values.title,
        description: values.description,
        body: values.body,
        tagList: tags,
      }

      // TODO: Replace with actual tRPC calls when server is ready
      if (isEditing) {
        // const result = await trpc.articles.updateArticle.mutate({
        //   slug,
        //   article: articleData
        // })
        console.log('Updating article:', articleData)
      } else {
        // const result = await trpc.articles.createArticle.mutate({
        //   article: articleData
        // })
        console.log('Creating article:', articleData)
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock slug generation for new articles
      const resultSlug = isEditing ? slug : values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      
      router.push(`/article/${resultSlug}`)
    } catch (err) {
      console.error('Failed to save article:', err)
      setError(err instanceof Error ? err.message : 'Failed to save article. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleAddTag() {
    const trimmedTag = tagInput.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags(prev => [...prev, trimmedTag])
      setTagInput('')
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  function handleTagInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1])
    }
  }

  if (!session && !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  if (isLoadingArticle) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error && isEditing) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error}</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Go Home
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Update your article content and settings'
              : 'Share your knowledge with the community'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <FormLabel htmlFor="title">Article Title</FormLabel>
              <Input
                id="title"
                {...register('title')}
                placeholder="What's this article about?"
                disabled={isLoading}
              />
              {errors.title && (
                <FormMessage>{errors.title.message}</FormMessage>
              )}
            </FormField>

                         <FormField>
               <FormLabel htmlFor="description">What&apos;s this article about?</FormLabel>
               <Input
                 id="description"
                 {...register('description')}
                 placeholder="What's this article about?"
                 disabled={isLoading}
               />
               {errors.description && (
                 <FormMessage>{errors.description.message}</FormMessage>
               )}
             </FormField>

            <FormField>
              <FormLabel htmlFor="body">Write your article (in markdown)</FormLabel>
              <Textarea
                id="body"
                {...register('body')}
                placeholder="Write your article content here..."
                disabled={isLoading}
                rows={12}
                className="font-mono text-sm"
              />
              {errors.body && (
                <FormMessage>{errors.body.message}</FormMessage>
              )}
            </FormField>

            {/* Tags Section */}
            <FormField>
              <FormLabel htmlFor="tags">Tags</FormLabel>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Enter tags..."
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || isLoading}
                    variant="outline"
                    size="sm"
                  >
                    Add Tag
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          disabled={isLoading}
                          className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                                 <p className="text-sm text-gray-500">
                   Press Enter or click &quot;Add Tag&quot; to add tags. Click × to remove.
                 </p>
              </div>
            </FormField>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? (isEditing ? 'Updating...' : 'Publishing...') 
                  : (isEditing ? 'Update Article' : 'Publish Article')
                }
              </Button>
            </div>
          </Form>

          {/* Markdown Help */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-medium mb-3">Markdown Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <code># Heading 1</code>
                <br />
                <code>## Heading 2</code>
                <br />
                <code>### Heading 3</code>
              </div>
              <div>
                <code>**Bold text**</code>
                <br />
                <code>*Italic text*</code>
                <br />
                <code>[Link](url)</code>
              </div>
              <div>
                <code>- List item</code>
                <br />
                <code>1. Numbered item</code>
              </div>
              <div>
                <code>`code`</code>
                <br />
                <code>```code block```</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 