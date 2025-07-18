import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, boolean, integer, uuid, varchar, index } from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  bio: text('bio'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Articles table
export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  body: text('body').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('articles_slug_idx').on(table.slug),
  authorIdx: index('articles_author_idx').on(table.authorId),
  createdAtIdx: index('articles_created_at_idx').on(table.createdAt),
}))

// Comments table
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  body: text('body').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  articleId: uuid('article_id').references(() => articles.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  articleIdx: index('comments_article_idx').on(table.articleId),
  authorIdx: index('comments_author_idx').on(table.authorId),
}))

// User follows table (many-to-many relationship)
export const userFollows = pgTable('user_follows', {
  id: uuid('id').primaryKey().defaultRandom(),
  followerId: uuid('follower_id').references(() => users.id).notNull(),
  followingId: uuid('following_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  followerIdx: index('follows_follower_idx').on(table.followerId),
  followingIdx: index('follows_following_idx').on(table.followingId),
  uniqueFollow: index('unique_follow_idx').on(table.followerId, table.followingId),
}))

// Article favorites table (many-to-many relationship)
export const articleFavorites = pgTable('article_favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  articleId: uuid('article_id').references(() => articles.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('favorites_user_idx').on(table.userId),
  articleIdx: index('favorites_article_idx').on(table.articleId),
  uniqueFavorite: index('unique_favorite_idx').on(table.userId, table.articleId),
}))

// Article tags table
export const articleTags = pgTable('article_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').references(() => articles.id).notNull(),
  tag: varchar('tag', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  articleIdx: index('tags_article_idx').on(table.articleId),
  tagIdx: index('tags_tag_idx').on(table.tag),
}))

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
  comments: many(comments),
  followers: many(userFollows, { relationName: 'follower' }),
  following: many(userFollows, { relationName: 'following' }),
  favoriteArticles: many(articleFavorites),
}))

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, { 
    fields: [articles.authorId], 
    references: [users.id] 
  }),
  comments: many(comments),
  favorites: many(articleFavorites),
  tags: many(articleTags),
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id]
  }),
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id]
  }),
}))

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, {
    fields: [userFollows.followerId],
    references: [users.id],
    relationName: 'follower'
  }),
  following: one(users, {
    fields: [userFollows.followingId],
    references: [users.id],
    relationName: 'following'
  }),
}))

export const articleFavoritesRelations = relations(articleFavorites, ({ one }) => ({
  user: one(users, {
    fields: [articleFavorites.userId],
    references: [users.id]
  }),
  article: one(articles, {
    fields: [articleFavorites.articleId],
    references: [articles.id]
  }),
}))

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleTags.articleId],
    references: [articles.id]
  }),
})) 