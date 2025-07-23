import { z } from "zod";

import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  passwordSchema,
  emailSchema,
  usernameSchema,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
} from "../../src/validation/user";
describe("User Validation Schemas", () => {
  describe("passwordSchema", () => {
    it("should accept valid passwords", () => {
      const validPasswords = [
        "Password123!",
        "MyStr0ng@Pass",
        "TestPass1!",
        "Complex@Pass1",
      ];
      validPasswords.forEach((password) => {
        expect(() => passwordSchema.parse(password)).not.toThrow();
      });
    });
    it("should reject passwords that are too short", () => {
      const shortPasswords = ["123", "short", "Pass1!"];
      shortPasswords.forEach((password) => {
        expect(() => passwordSchema.parse(password)).toThrow(z.ZodError);
      });
    });
    it("should reject passwords without uppercase letters", () => {
      const noUppercase = ["password123!", "lowercase@123", "test123!"];
      noUppercase.forEach((password) => {
        expect(() => passwordSchema.parse(password)).toThrow(z.ZodError);
      });
    });
    it("should reject passwords without lowercase letters", () => {
      const noLowercase = ["PASSWORD123!", "UPPERCASE@123", "TEST123!"];
      noLowercase.forEach((password) => {
        expect(() => passwordSchema.parse(password)).toThrow(z.ZodError);
      });
    });
    it("should reject passwords without numbers", () => {
      const noNumbers = ["Password!", "NoNumbers@Test", "OnlyLetters!"];
      noNumbers.forEach((password) => {
        expect(() => passwordSchema.parse(password)).toThrow(z.ZodError);
      });
    });
    it("should reject passwords without special characters", () => {
      const noSpecial = ["Password123", "NoSpecial123", "TestPassword1"];
      noSpecial.forEach((password) => {
        expect(() => passwordSchema.parse(password)).toThrow(z.ZodError);
      });
    });
    it("should reject passwords that are too long", () => {
      const tooLong = "A".repeat(129) + "1!";
      expect(() => passwordSchema.parse(tooLong)).toThrow(z.ZodError);
    });
  });
  describe("emailSchema", () => {
    it("should accept valid email addresses", () => {
      const validEmails = [
        "user@example.com",
        "test.email@domain.co.uk",
        "user+tag@example.org",
        "firstname.lastname@company.com",
        "user123@test-domain.net",
      ];
      validEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });
    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "notanemail",
        "@domain.com",
        "user@",
        "user@domain",
        "user.domain.com",
        "user @domain.com",
        "user@domain .com",
        "",
      ];
      invalidEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).toThrow(z.ZodError);
      });
    });
    it("should normalize email to lowercase", () => {
      const email = "User@EXAMPLE.COM";
      const result = emailSchema.parse(email);
      expect(result).toBe("user@example.com");
    });
  });
  describe("usernameSchema", () => {
    it("should accept valid usernames", () => {
      const validUsernames = [
        "user123",
        "test_user",
        "TestUser",
        "user-name",
        "u",
        "a".repeat(30),
      ];
      validUsernames.forEach((username) => {
        expect(() => usernameSchema.parse(username)).not.toThrow();
      });
    });
    it("should reject usernames that are too short", () => {
      expect(() => usernameSchema.parse("")).toThrow(z.ZodError);
    });
    it("should reject usernames that are too long", () => {
      const tooLong = "a".repeat(31);
      expect(() => usernameSchema.parse(tooLong)).toThrow(z.ZodError);
    });
    it("should reject usernames with invalid characters", () => {
      const invalidUsernames = [
        "user@name",
        "user name",
        "user!",
        "user#name",
        "user%name",
      ];
      invalidUsernames.forEach((username) => {
        expect(() => usernameSchema.parse(username)).toThrow(z.ZodError);
      });
    });
  });
  describe("registerSchema", () => {
    const validUser = {
      username: "testuser",
      email: "test@example.com",
      password: "TestPassword123!",
    };
    it("should accept valid registration data", () => {
      expect(() => registerSchema.parse({ user: validUser })).not.toThrow();
    });
    it("should validate all required fields", () => {
      const requiredFields = ["username", "email", "password"];
      requiredFields.forEach((field) => {
        const invalidUser = { ...validUser };
        delete invalidUser[field];
        expect(() => registerSchema.parse({ user: invalidUser })).toThrow(
          z.ZodError,
        );
      });
    });
    it("should reject extra fields", () => {
      const userWithExtra = {
        ...validUser,
        extraField: "not allowed",
      };
      expect(() => registerSchema.parse({ user: userWithExtra })).toThrow(
        z.ZodError,
      );
    });
    it("should validate nested user object structure", () => {
      expect(() => registerSchema.parse(validUser)).toThrow(z.ZodError);
      expect(() => registerSchema.parse({ user: validUser })).not.toThrow();
    });
  });
  describe("loginSchema", () => {
    const validLogin = {
      email: "test@example.com",
      password: "TestPassword123!",
    };
    it("should accept valid login data", () => {
      expect(() => loginSchema.parse({ user: validLogin })).not.toThrow();
    });
    it("should validate required email and password", () => {
      expect(() =>
        loginSchema.parse({ user: { email: validLogin.email } }),
      ).toThrow(z.ZodError);
      expect(() =>
        loginSchema.parse({ user: { password: validLogin.password } }),
      ).toThrow(z.ZodError);
    });
    it("should validate email format in login", () => {
      const invalidLogin = {
        ...validLogin,
        email: "invalid-email",
      };
      expect(() => loginSchema.parse({ user: invalidLogin })).toThrow(
        z.ZodError,
      );
    });
  });
  describe("updateUserSchema", () => {
    it("should accept partial updates", () => {
      const partialUpdates = [
        { user: { email: "new@example.com" } },
        { user: { username: "newusername" } },
        { user: { bio: "New bio" } },
        { user: { image: "https://example.com/image.jpg" } },
      ];
      partialUpdates.forEach((update) => {
        expect(() => updateUserSchema.parse(update)).not.toThrow();
      });
    });
    it("should accept empty updates", () => {
      expect(() => updateUserSchema.parse({ user: {} })).not.toThrow();
    });
    it("should validate email format when provided", () => {
      const invalidUpdate = { user: { email: "invalid-email" } };
      expect(() => updateUserSchema.parse(invalidUpdate)).toThrow(z.ZodError);
    });
    it("should validate username format when provided", () => {
      const invalidUpdate = { user: { username: "invalid@username" } };
      expect(() => updateUserSchema.parse(invalidUpdate)).toThrow(z.ZodError);
    });
    it("should allow bio up to 1000 characters", () => {
      const longBio = "a".repeat(1000);
      const tooLongBio = "a".repeat(1001);
      expect(() =>
        updateUserSchema.parse({ user: { bio: longBio } }),
      ).not.toThrow();
      expect(() =>
        updateUserSchema.parse({ user: { bio: tooLongBio } }),
      ).toThrow(z.ZodError);
    });
    it("should validate image URL format", () => {
      const validUrls = [
        "https://example.com/image.jpg",
        "http://example.com/image.png",
        "https://cdn.example.com/path/to/image.gif",
      ];
      const invalidUrls = [
        "not-a-url",
        "ftp://example.com/image.jpg",
        "https://",
        "example.com/image.jpg",
      ];
      validUrls.forEach((url) => {
        expect(() =>
          updateUserSchema.parse({ user: { image: url } }),
        ).not.toThrow();
      });
      invalidUrls.forEach((url) => {
        expect(() => updateUserSchema.parse({ user: { image: url } })).toThrow(
          z.ZodError,
        );
      });
    });
  });
  describe("Validation Helper Functions", () => {
    describe("validateUserRegistration", () => {
      it("should return success for valid registration data", () => {
        const validUser = {
          username: "testuser",
          email: "test@example.com",
          password: "TestPassword123!",
        };
        const result = validateUserRegistration({ user: validUser });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.user.email).toBe("test@example.com");
        }
      });
      it("should return error for invalid registration data", () => {
        const invalidUser = {
          username: "ab", // too short
          email: "invalid-email",
          password: "weak",
        };
        const result = validateUserRegistration({ user: invalidUser });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(0);
        }
      });
    });
    describe("validateUserLogin", () => {
      it("should return success for valid login data", () => {
        const validLogin = {
          email: "test@example.com",
          password: "TestPassword123!",
        };
        const result = validateUserLogin({ user: validLogin });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.user.email).toBe("test@example.com");
        }
      });
      it("should return error for invalid login data", () => {
        const invalidLogin = {
          email: "invalid-email",
          password: "",
        };
        const result = validateUserLogin({ user: invalidLogin });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(0);
        }
      });
    });
    describe("validateUserUpdate", () => {
      it("should return success for valid update data", () => {
        const validUpdate = {
          email: "newemail@example.com",
          bio: "Updated bio",
        };
        const result = validateUserUpdate({ user: validUpdate });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.user.email).toBe("newemail@example.com");
        }
      });
      it("should return error for invalid update data", () => {
        const invalidUpdate = {
          email: "invalid-email",
          bio: "a".repeat(1001), // too long
        };
        const result = validateUserUpdate({ user: invalidUpdate });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(0);
        }
      });
      it("should return success for empty update", () => {
        const result = validateUserUpdate({ user: {} });
        expect(result.success).toBe(true);
      });
    });
  });
});
