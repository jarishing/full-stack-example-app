import { z } from "zod";

import { emailSchema, createUrlSchema, commonConstraints } from "./common";

/**
 * User-specific validation schemas
 * Uses common schemas where possible for consistency
 */

// Password validation with enterprise security requirements
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password must be no more than 128 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  );

// Username validation with business rules
const usernameSchema = z
  .string()
  .min(1, "Username is required")
  .max(30, "Username must be no more than 30 characters long")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, underscores, and hyphens",
  );

// Bio validation using common constraints
const bioSchema = z
  .string()
  .max(
    commonConstraints.longText.max,
    `Bio must be no more than ${commonConstraints.longText.max} characters`,
  )
  .optional();

// Image URL validation (HTTP/HTTPS only for security)
const imageUrlSchema = createUrlSchema(["http", "https"]).optional();

// User registration schema
export const userRegistrationSchema = z.object({
  user: z
    .object({
      username: usernameSchema,
      email: emailSchema,
      password: passwordSchema,
      bio: bioSchema,
      image: imageUrlSchema,
    })
    .strict(),
});

// User login schema
export const userLoginSchema = z.object({
  user: z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  }),
});

// User update schema (all fields optional except structure)
export const userUpdateSchema = z.object({
  user: z.object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    bio: bioSchema,
    image: imageUrlSchema,
  }),
});

// Type exports for TypeScript integration
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

// Validation helper functions
export const validateUserRegistration = (data: unknown) => {
  return userRegistrationSchema.safeParse(data);
};

export const validateUserLogin = (data: unknown) => {
  return userLoginSchema.safeParse(data);
};

export const validateUserUpdate = (data: unknown) => {
  return userUpdateSchema.safeParse(data);
};

// Export individual schemas for testing
export {
  passwordSchema,
  emailSchema,
  usernameSchema,
  userRegistrationSchema as registerSchema,
  userLoginSchema as loginSchema,
  userUpdateSchema as updateUserSchema,
};
