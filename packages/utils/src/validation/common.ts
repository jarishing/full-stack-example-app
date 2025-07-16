import { z } from "zod";

/**
 * Common validation schemas used across multiple entities
 * These promote consistency and reduce duplication
 */

// Common string constraints
export const commonConstraints = {
  // Text field lengths (based on database constraints and UX)
  shortText: { min: 1, max: 100 }, // titles, names
  mediumText: { min: 1, max: 255 }, // descriptions
  longText: { min: 1, max: 1000 }, // bios, comments
  veryLongText: { min: 1, max: 50000 }, // article bodies

  // Numeric constraints
  positiveInt: { min: 1 },
  pagination: { min: 0, max: 100 },

  // Collection constraints
  tags: { minItems: 0, maxItems: 10, maxTagLength: 20 },
} as const;

/**
 * Reusable base schemas for common field types
 */

// Text field schemas
export const createTextSchema = (
  constraints: { min: number; max: number },
  fieldName: string,
) =>
  z
    .string()
    .trim()
    .min(constraints.min, `${fieldName} is required`)
    .max(
      constraints.max,
      `${fieldName} must be no more than ${constraints.max} characters`,
    );

// URL schema with protocol validation
export const createUrlSchema = (protocols: string[] = ["http", "https"]) =>
  z
    .string()
    .url("Invalid URL format")
    .refine(
      (url) => protocols.some((protocol) => url.startsWith(`${protocol}://`)),
      `URL must use one of these protocols: ${protocols.join(", ")}`,
    );

// Pagination schemas
export const limitSchema = z.coerce
  .number()
  .int()
  .min(1, "Limit must be at least 1")
  .max(100, "Limit cannot exceed 100")
  .default(20);

export const offsetSchema = z.coerce
  .number()
  .int()
  .min(0, "Offset must be non-negative")
  .default(0);

// Common ID validation
export const idSchema = z.string().uuid("Invalid ID format");

// Common email validation with normalization
export const emailSchema = z.preprocess(
  (input) => (typeof input === "string" ? input.trim() : input),
  z.string().email("Please enter a valid email address").toLowerCase(),
);

/**
 * Type exports for better TypeScript integration
 */
export type CommonConstraints = typeof commonConstraints;
export type EmailType = z.infer<typeof emailSchema>;
export type IdType = z.infer<typeof idSchema>;
