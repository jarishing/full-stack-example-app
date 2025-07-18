'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { Button, Card, CardContent, CardHeader, Avatar } from '@conduit/ui'
import { useAuthStore } from '@/store/auth'
import type { Profile, Article } from '@conduit/api-types'

interface ProfilePageData {
  profile: Profile
  articles: Article[]
  articlesCount: number
}

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { data: session } = useSession()
  const { user } = useAuthStore()
  
  const [profileData, setProfileData] = useState<ProfilePageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'my' | 'favorited'>('my')

  const isOwnProfile = user?.username === username

  useEffect(() => {
    loadProfile()
  }, [username])

  async function loadProfile() {
    setIsLoading(true)
    try {
      // TODO: Replace with actual tRPC calls when server is ready
      // const [profileResult, articlesResult] = await Promise.all([
      //   trpc.profiles.getProfile.query({ username }),
      //   trpc.articles.getArticles.query({ author: username })
      // ])

      // Mock profile data
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockProfile: Profile = {
        username,
        bio: `Bio for ${username}. This is a sample bio that describes the user.`,
        image: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face`,
        following: Math.random() > 0.5,
      }

      const mockArticles: Article[] = Array.from({ length: 3 }, (_, i) => ({
        slug: `${username}-article-${i + 1}`,
        title: `Sample Article ${i + 1} by ${username}`,
        description: `This is a sample article description written by ${username}.`,
        body: 'Article content here...',
        tagList: ['javascript', 'react', 'nextjs'],
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        favorited: Math.random() > 0.5,
        favoritesCount: Math.floor(Math.random() * 20),
        author: mockProfile,
      }))

      setProfileData({
        profile: mockProfile,
        articles: mockArticles,
        articlesCount: mockArticles.length,
      })
      setIsFollowing(mockProfile.following)
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleFollowToggle() {
    if (!session) return

    setIsFollowLoading(true)
    try {
      // TODO: Replace with actual tRPC call when server is ready
      // if (isFollowing) {
      //   await trpc.profiles.unfollowUser.mutate({ username })
      // } else {
      //   await trpc.profiles.followUser.mutate({ username })
      // }

      await new Promise(resolve => setTimeout(resolve, 500))
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    } finally {
      setIsFollowLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600">Profile not found</h1>
      </div>
    )
  }

  const { profile, articles, articlesCount } = profileData

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardHeader className="text-center py-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar
              src={profile.image}
              alt={profile.username}
              fallback={profile.username[0]}
              size="lg"
            />
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              {profile.bio && (
                <p className="text-gray-600 mt-2 max-w-md">{profile.bio}</p>
              )}
            </div>
            
            {session && !isOwnProfile && (
              <Button
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
                variant={isFollowing ? "outline" : "default"}
                size="sm"
              >
                {isFollowLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'} {profile.username}
              </Button>
            )}
            
            {isOwnProfile && (
              <Button asChild size="sm" variant="outline">
                <Link href="/settings">Edit Profile</Link>
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Articles Section */}
      <div className="space-y-6">
        <div className="border-b">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('my')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Articles ({articlesCount})
            </button>
            <button
              onClick={() => setActiveTab('favorited')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'favorited'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Favorited Articles
            </button>
          </nav>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.length === 0 ? (
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
                        <span className="font-medium">{article.author.username}</span>
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
                        <div className="flex flex-wrap gap-1">
                          {article.tagList.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
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
    </div>
  )
} 