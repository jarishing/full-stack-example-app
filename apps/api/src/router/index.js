import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, articles, articleTags } from '../database/schema';
import { eq, desc, and } from 'drizzle-orm';
const t = initTRPC.context().create();
// Base procedures
export const router = t.router;
export const publicProcedure = t.procedure;
// Authentication middleware
const authMiddleware = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
        });
    }
    return next({
        ctx: {
            ...ctx,
            user: ctx.user, // Now TypeScript knows user is defined
        },
    });
});
// Protected procedure
export const protectedProcedure = publicProcedure.use(authMiddleware);
// Helper function to generate slug
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        + '-' + Math.random().toString(36).substr(2, 9);
}
// Helper function to generate JWT
function generateToken(userId) {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}
export const appRouter = router({
    // Authentication procedures
    auth: router({
        // Register new user
        register: publicProcedure
            .input(z.object({
            email: z.string().email(),
            username: z.string().min(3).max(20),
            password: z.string().min(8),
        }))
            .mutation(async ({ input, ctx }) => {
            const { email, username, password } = input;
            // Hash password
            const passwordHash = await bcrypt.hash(password, 12);
            try {
                // Create user
                const [newUser] = await ctx.db.insert(users).values({
                    email,
                    username,
                    passwordHash,
                }).returning();
                // Generate token
                const token = generateToken(newUser.id);
                return {
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        username: newUser.username,
                        bio: newUser.bio,
                        image: newUser.image,
                    },
                    token,
                };
            }
            catch (error) {
                console.error('Database error details:', error);
                if (error.code === '23505') { // Unique constraint violation
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'Email or username already exists',
                    });
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to create user',
                });
            }
        }),
        // Login user
        login: publicProcedure
            .input(z.object({
            email: z.string().email(),
            password: z.string(),
        }))
            .mutation(async ({ input, ctx }) => {
            const { email, password } = input;
            // Find user
            const [user] = await ctx.db.select().from(users).where(eq(users.email, email));
            if (!user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Invalid credentials',
                });
            }
            // Verify password
            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (!isValid) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Invalid credentials',
                });
            }
            // Generate token
            const token = generateToken(user.id);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    bio: user.bio,
                    image: user.image,
                },
                token,
            };
        }),
        // Get current user
        me: protectedProcedure
            .query(async ({ ctx }) => {
            return {
                user: ctx.user,
            };
        }),
    }),
    // Article procedures
    articles: router({
        // Get all articles
        list: publicProcedure
            .input(z.object({
            limit: z.number().min(1).max(100).default(20),
            offset: z.number().min(0).default(0),
            tag: z.string().optional(),
            author: z.string().optional(),
        }))
            .query(async ({ input, ctx }) => {
            const { limit, offset, tag, author } = input;
            // Build query conditions
            const conditions = [];
            if (author) {
                const [authorUser] = await ctx.db
                    .select({ id: users.id })
                    .from(users)
                    .where(eq(users.username, author));
                if (authorUser) {
                    conditions.push(eq(articles.authorId, authorUser.id));
                }
            }
            // For simplicity, get all articles first
            // In production, you'd want to optimize this with proper joins
            const articlesData = await ctx.db
                .select({
                id: articles.id,
                slug: articles.slug,
                title: articles.title,
                description: articles.description,
                body: articles.body,
                createdAt: articles.createdAt,
                updatedAt: articles.updatedAt,
                author: {
                    username: users.username,
                    bio: users.bio,
                    image: users.image,
                },
            })
                .from(articles)
                .leftJoin(users, eq(articles.authorId, users.id))
                .where(conditions.length > 0 ? and(...conditions) : undefined)
                .orderBy(desc(articles.createdAt))
                .limit(limit)
                .offset(offset);
            // Get tags for each article
            const articlesWithTags = await Promise.all(articlesData.map(async (article) => {
                const tags = await ctx.db
                    .select({ tag: articleTags.tag })
                    .from(articleTags)
                    .where(eq(articleTags.articleId, article.id));
                return {
                    ...article,
                    tagList: tags.map(t => t.tag),
                    favorited: false, // TODO: Check if current user favorited
                    favoritesCount: 0, // TODO: Count favorites
                };
            }));
            return {
                articles: articlesWithTags,
                articlesCount: articlesWithTags.length,
            };
        }),
        // Create article
        create: protectedProcedure
            .input(z.object({
            title: z.string().min(1),
            description: z.string().min(1),
            body: z.string().min(1),
            tagList: z.array(z.string()).default([]),
        }))
            .mutation(async ({ input, ctx }) => {
            const { title, description, body, tagList } = input;
            const slug = generateSlug(title);
            try {
                // Create article
                const [newArticle] = await ctx.db.insert(articles).values({
                    slug,
                    title,
                    description,
                    body,
                    authorId: ctx.user.id,
                }).returning();
                // Add tags
                if (tagList.length > 0) {
                    await ctx.db.insert(articleTags).values(tagList.map(tag => ({
                        articleId: newArticle.id,
                        tag,
                    })));
                }
                return {
                    article: {
                        ...newArticle,
                        tagList,
                        favorited: false,
                        favoritesCount: 0,
                        author: {
                            username: ctx.user.username,
                            bio: ctx.user.bio,
                            image: ctx.user.image,
                            following: false,
                        },
                    },
                };
            }
            catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to create article',
                });
            }
        }),
        // Get single article by slug
        bySlug: publicProcedure
            .input(z.object({
            slug: z.string(),
        }))
            .query(async ({ input, ctx }) => {
            const { slug } = input;
            const [articleData] = await ctx.db
                .select({
                id: articles.id,
                slug: articles.slug,
                title: articles.title,
                description: articles.description,
                body: articles.body,
                createdAt: articles.createdAt,
                updatedAt: articles.updatedAt,
                author: {
                    username: users.username,
                    bio: users.bio,
                    image: users.image,
                },
            })
                .from(articles)
                .leftJoin(users, eq(articles.authorId, users.id))
                .where(eq(articles.slug, slug));
            if (!articleData) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Article not found',
                });
            }
            // Get tags
            const tags = await ctx.db
                .select({ tag: articleTags.tag })
                .from(articleTags)
                .where(eq(articleTags.articleId, articleData.id));
            return {
                article: {
                    ...articleData,
                    tagList: tags.map(t => t.tag),
                    favorited: false, // TODO: Check if current user favorited
                    favoritesCount: 0, // TODO: Count favorites
                },
            };
        }),
    }),
    // Health check
    health: publicProcedure
        .query(() => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }),
});
