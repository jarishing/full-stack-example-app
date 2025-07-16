import { z } from "zod";

import {
  createTextSchema,
  commonConstraints,
  limitSchema,
  offsetSchema,
} from "./common";

/**
 * Article-specific validation schemas
 * Uses common schemas and constraints for consistency
 */

// Article field schemas using common text validation
const titleSchema = createTextSchema(
  commonConstraints.shortText,
  "Title",
).refine(
  (title) => title.length <= 200,
  "Title must be no more than 200 characters",
);

const descriptionSchema = createTextSchema(
  commonConstraints.mediumText,
  "Description",
);

const bodySchema = createTextSchema(
  commonConstraints.veryLongText,
  "Article body",
);

// Tag list validation using common constraints
const tagListSchema = z
  .array(
    z
      .string()
      .min(1, "Tag cannot be empty")
      .max(
        commonConstraints.tags.maxTagLength,
        `Tag must be no more than ${commonConstraints.tags.maxTagLength} characters`,
      ),
  )
  .max(
    commonConstraints.tags.maxItems,
    `Maximum ${commonConstraints.tags.maxItems} tags allowed`,
  )
  .default([])
  .transform((tags) => tags.map((tag) => tag.toLowerCase()))
  .refine((tags) => new Set(tags).size === tags.length, {
    message: "Duplicate tags are not allowed",
  });

// Article creation schema
export const createArticleSchema = z.object({
  article: z
    .object({
      title: titleSchema,
      description: descriptionSchema,
      body: bodySchema,
      tagList: tagListSchema,
    })
    .strict(),
});

// Article update schema
export const updateArticleSchema = z.object({
  article: z.object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    body: bodySchema.optional(),
    tagList: tagListSchema.optional(),
  }),
});

// Get articles query schema
export const getArticlesQuerySchema = z.object({
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
  limit: limitSchema,
  offset: offsetSchema,
});

// Get article feed query schema
export const getArticleFeedQuerySchema = z.object({
  limit: limitSchema,
  offset: offsetSchema,
});

// Comment body validation using common constraints
const commentBodySchema = createTextSchema(
  commonConstraints.longText,
  "Comment",
);

// Add comment schema
export const addCommentSchema = z.object({
  comment: z.object({
    body: commentBodySchema,
  }),
});

// Get comments query schema
export const getCommentsQuerySchema = z.object({
  limit: limitSchema.default(10),
  offset: offsetSchema,
});

// Type exports for TypeScript integration
export type CreateArticle = z.infer<typeof createArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;
export type GetArticlesQuery = z.infer<typeof getArticlesQuerySchema>;
export type GetArticleFeedQuery = z.infer<typeof getArticleFeedQuerySchema>;
export type AddComment = z.infer<typeof addCommentSchema>;
export type GetCommentsQuery = z.infer<typeof getCommentsQuerySchema>;

// Validation helper functions
export const validateCreateArticle = (data: unknown) => {
  return createArticleSchema.safeParse(data);
};

export const validateUpdateArticle = (data: unknown) => {
  return updateArticleSchema.safeParse(data);
};

export const validateGetArticlesQuery = (data: unknown) => {
  return getArticlesQuerySchema.safeParse(data);
};

export const validateGetArticleFeedQuery = (data: unknown) => {
  return getArticleFeedQuerySchema.safeParse(data);
};

export const validateAddComment = (data: unknown) => {
  return addCommentSchema.safeParse(data);
};

export const validateGetCommentsQuery = (data: unknown) => {
  return getCommentsQuerySchema.safeParse(data);
};

// Export individual schemas for testing
export {
  titleSchema,
  descriptionSchema,
  bodySchema,
  tagListSchema,
  getArticlesQuerySchema as getArticlesSchema,
  getArticleFeedQuerySchema as getFeedSchema,
  addCommentSchema as createCommentSchema,
};
