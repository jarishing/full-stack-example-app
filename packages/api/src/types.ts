import { z } from 'zod'

// ============================================================================
// Base Types
// ============================================================================

export const UserSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  username: z.string(),
  bio: z.string().nullable(),
  image: z.string().url().nullable(),
})

export const ProfileSchema = z.object({
  username: z.string(),
  bio: z.string().nullable(),
  image: z.string().url().nullable(),
  following: z.boolean(),
})

export const ArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  favorited: z.boolean(),
  favoritesCount: z.number(),
  author: ProfileSchema,
})

export const CommentSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  body: z.string(),
  author: ProfileSchema,
})

// ============================================================================
// Request/Response Types
// ============================================================================

// Auth
export const LoginRequestSchema = z.object({
  user: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
})

export const RegisterRequestSchema = z.object({
  user: z.object({
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
  }),
})

export const UpdateUserRequestSchema = z.object({
  user: z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string().min(8).optional(),
    bio: z.string().optional(),
    image: z.string().url().optional(),
  }),
})

export const UserResponseSchema = z.object({
  user: UserSchema,
})

// Profile
export const ProfileResponseSchema = z.object({
  profile: ProfileSchema,
})

// Articles
export const CreateArticleRequestSchema = z.object({
  article: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    body: z.string().min(1),
    tagList: z.array(z.string()).optional(),
  }),
})

export const UpdateArticleRequestSchema = z.object({
  article: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    body: z.string().optional(),
    tagList: z.array(z.string()).optional(),
  }),
})

export const ArticleResponseSchema = z.object({
  article: ArticleSchema,
})

export const ArticlesResponseSchema = z.object({
  articles: z.array(ArticleSchema),
  articlesCount: z.number(),
})

export const ArticlesQuerySchema = z.object({
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

export const FeedQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

// Comments
export const CreateCommentRequestSchema = z.object({
  comment: z.object({
    body: z.string().min(1),
  }),
})

export const CommentResponseSchema = z.object({
  comment: CommentSchema,
})

export const CommentsResponseSchema = z.object({
  comments: z.array(CommentSchema),
})

// Tags
export const TagsResponseSchema = z.object({
  tags: z.array(z.string()),
})

// ============================================================================
// tRPC Router Type Definition
// ============================================================================

export interface AppRouter {
  // Authentication routes
  auth: {
    login: {
      input: z.infer<typeof LoginRequestSchema>
      output: z.infer<typeof UserResponseSchema>
    }
    register: {
      input: z.infer<typeof RegisterRequestSchema>
      output: z.infer<typeof UserResponseSchema>
    }
    getCurrentUser: {
      input: void
      output: z.infer<typeof UserResponseSchema>
    }
    updateUser: {
      input: z.infer<typeof UpdateUserRequestSchema>
      output: z.infer<typeof UserResponseSchema>
    }
  }

  // Profile routes
  profiles: {
    getProfile: {
      input: { username: string }
      output: z.infer<typeof ProfileResponseSchema>
    }
    followUser: {
      input: { username: string }
      output: z.infer<typeof ProfileResponseSchema>
    }
    unfollowUser: {
      input: { username: string }
      output: z.infer<typeof ProfileResponseSchema>
    }
  }

  // Article routes
  articles: {
    getArticles: {
      input: z.infer<typeof ArticlesQuerySchema>
      output: z.infer<typeof ArticlesResponseSchema>
    }
    getFeed: {
      input: z.infer<typeof FeedQuerySchema>
      output: z.infer<typeof ArticlesResponseSchema>
    }
    getArticle: {
      input: { slug: string }
      output: z.infer<typeof ArticleResponseSchema>
    }
    createArticle: {
      input: z.infer<typeof CreateArticleRequestSchema>
      output: z.infer<typeof ArticleResponseSchema>
    }
    updateArticle: {
      input: { slug: string } & z.infer<typeof UpdateArticleRequestSchema>
      output: z.infer<typeof ArticleResponseSchema>
    }
    deleteArticle: {
      input: { slug: string }
      output: void
    }
    favoriteArticle: {
      input: { slug: string }
      output: z.infer<typeof ArticleResponseSchema>
    }
    unfavoriteArticle: {
      input: { slug: string }
      output: z.infer<typeof ArticleResponseSchema>
    }
  }

  // Comment routes
  comments: {
    getComments: {
      input: { slug: string }
      output: z.infer<typeof CommentsResponseSchema>
    }
    createComment: {
      input: { slug: string } & z.infer<typeof CreateCommentRequestSchema>
      output: z.infer<typeof CommentResponseSchema>
    }
    deleteComment: {
      input: { slug: string; id: number }
      output: void
    }
  }

  // Tag routes
  tags: {
    getTags: {
      input: void
      output: z.infer<typeof TagsResponseSchema>
    }
  }
}

// ============================================================================
// Exported Types
// ============================================================================

export type User = z.infer<typeof UserSchema>
export type Profile = z.infer<typeof ProfileSchema>
export type Article = z.infer<typeof ArticleSchema>
export type Comment = z.infer<typeof CommentSchema>

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>
export type CreateArticleRequest = z.infer<typeof CreateArticleRequestSchema>
export type UpdateArticleRequest = z.infer<typeof UpdateArticleRequestSchema>
export type CreateCommentRequest = z.infer<typeof CreateCommentRequestSchema>
export type ArticlesQuery = z.infer<typeof ArticlesQuerySchema>
export type FeedQuery = z.infer<typeof FeedQuerySchema>

export type UserResponse = z.infer<typeof UserResponseSchema>
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>
export type ArticlesResponse = z.infer<typeof ArticlesResponseSchema>
export type CommentResponse = z.infer<typeof CommentResponseSchema>
export type CommentsResponse = z.infer<typeof CommentsResponseSchema>
export type TagsResponse = z.infer<typeof TagsResponseSchema> 