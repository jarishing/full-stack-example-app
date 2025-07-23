import {
  commonConstraints,
  createTextSchema,
  createUrlSchema,
  limitSchema,
  offsetSchema,
  idSchema,
  emailSchema,
} from "../../src/validation/common";
describe("Common Validation Schemas", () => {
  describe("commonConstraints", () => {
    it("should have expected constraint values", () => {
      expect(commonConstraints.shortText).toEqual({ min: 1, max: 100 });
      expect(commonConstraints.mediumText).toEqual({ min: 1, max: 255 });
      expect(commonConstraints.longText).toEqual({ min: 1, max: 1000 });
      expect(commonConstraints.veryLongText).toEqual({ min: 1, max: 50000 });
      expect(commonConstraints.positiveInt).toEqual({ min: 1 });
      expect(commonConstraints.pagination).toEqual({ min: 0, max: 100 });
      expect(commonConstraints.tags).toEqual({
        minItems: 0,
        maxItems: 10,
        maxTagLength: 20,
      });
    });
    it("should be a const object", () => {
      // commonConstraints is readonly at TypeScript level with 'as const'
      // This test just verifies the object structure is stable
      expect(typeof commonConstraints).toBe("object");
      expect(commonConstraints).toHaveProperty("shortText");
      expect(commonConstraints).toHaveProperty("mediumText");
    });
  });
  describe("createTextSchema", () => {
    it("should create a text schema with correct constraints", () => {
      const schema = createTextSchema({ min: 5, max: 20 }, "Test Field");
      expect(() => schema.parse("Valid")).not.toThrow();
      expect(() => schema.parse("This is a valid text")).not.toThrow();
    });
    it("should reject text that is too short", () => {
      const schema = createTextSchema({ min: 5, max: 20 }, "Test Field");
      expect(() => schema.parse("")).toThrow();
      expect(() => schema.parse("1234")).toThrow();
    });
    it("should reject text that is too long", () => {
      const schema = createTextSchema({ min: 5, max: 20 }, "Test Field");
      expect(() => schema.parse("This text is definitely too long")).toThrow();
    });
    it("should trim whitespace", () => {
      const schema = createTextSchema({ min: 5, max: 20 }, "Test Field");
      const result = schema.parse("  Valid Text  ");
      expect(result).toBe("Valid Text");
    });
    it("should use field name in error messages", () => {
      const schema = createTextSchema({ min: 5, max: 20 }, "Username");
      try {
        schema.parse("");
      } catch (error) {
        const zodError = error;
        expect(zodError.errors.length).toBeGreaterThan(0);
        expect(zodError.errors[0].message).toContain("Username");
      }
      try {
        schema.parse("This text is way too long for the field");
      } catch (error) {
        const zodError = error;
        expect(zodError.errors.length).toBeGreaterThan(0);
        expect(zodError.errors[0].message).toContain("Username");
        expect(zodError.errors[0].message).toContain("20");
      }
    });
  });
  describe("createUrlSchema", () => {
    it("should accept valid HTTP URLs by default", () => {
      const schema = createUrlSchema();
      expect(() => schema.parse("http://example.com")).not.toThrow();
      expect(() => schema.parse("https://example.com")).not.toThrow();
      expect(() => schema.parse("https://sub.example.com/path")).not.toThrow();
    });
    it("should reject non-HTTP protocols by default", () => {
      const schema = createUrlSchema();
      expect(() => schema.parse("ftp://example.com")).toThrow();
      expect(() => schema.parse("file:///path/to/file")).toThrow();
      expect(() => schema.parse("mailto:test@example.com")).toThrow();
    });
    it("should accept custom protocols when specified", () => {
      const schema = createUrlSchema(["ftp", "sftp"]);
      expect(() => schema.parse("ftp://example.com")).not.toThrow();
      expect(() => schema.parse("sftp://example.com")).not.toThrow();
      expect(() => schema.parse("http://example.com")).toThrow();
    });
    it("should reject invalid URLs", () => {
      const schema = createUrlSchema();
      expect(() => schema.parse("not-a-url")).toThrow();
      expect(() => schema.parse("example.com")).toThrow();
      expect(() => schema.parse("https://")).toThrow();
    });
    it("should provide informative error messages", () => {
      const schema = createUrlSchema(["https"]);
      try {
        schema.parse("http://example.com");
      } catch (error) {
        const zodError = error;
        expect(zodError.errors.length).toBeGreaterThan(0);
        expect(zodError.errors[0].message).toContain("https");
      }
    });
  });
  describe("limitSchema", () => {
    it("should accept valid limits", () => {
      expect(() => limitSchema.parse(1)).not.toThrow();
      expect(() => limitSchema.parse(50)).not.toThrow();
      expect(() => limitSchema.parse(100)).not.toThrow();
    });
    it("should coerce string numbers", () => {
      const result = limitSchema.parse("25");
      expect(result).toBe(25);
      expect(typeof result).toBe("number");
    });
    it("should apply default value", () => {
      const result = limitSchema.parse(undefined);
      expect(result).toBe(20);
    });
    it("should reject invalid limits", () => {
      expect(() => limitSchema.parse(0)).toThrow();
      expect(() => limitSchema.parse(-1)).toThrow();
      expect(() => limitSchema.parse(101)).toThrow();
    });
    it("should reject non-integer values", () => {
      expect(() => limitSchema.parse(1.5)).toThrow();
    });
  });
  describe("offsetSchema", () => {
    it("should accept valid offsets", () => {
      expect(() => offsetSchema.parse(0)).not.toThrow();
      expect(() => offsetSchema.parse(50)).not.toThrow();
      expect(() => offsetSchema.parse(1000)).not.toThrow();
    });
    it("should coerce string numbers", () => {
      const result = offsetSchema.parse("10");
      expect(result).toBe(10);
      expect(typeof result).toBe("number");
    });
    it("should apply default value", () => {
      const result = offsetSchema.parse(undefined);
      expect(result).toBe(0);
    });
    it("should reject negative offsets", () => {
      expect(() => offsetSchema.parse(-1)).toThrow();
      expect(() => offsetSchema.parse(-10)).toThrow();
    });
    it("should reject non-integer values", () => {
      expect(() => offsetSchema.parse(1.5)).toThrow();
    });
  });
  describe("idSchema", () => {
    it("should accept valid UUIDs", () => {
      const validUuids = [
        "123e4567-e89b-12d3-a456-426614174000",
        "550e8400-e29b-41d4-a716-446655440000",
        "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      ];
      validUuids.forEach((uuid) => {
        expect(() => idSchema.parse(uuid)).not.toThrow();
      });
    });
    it("should reject invalid UUIDs", () => {
      const invalidUuids = [
        "not-a-uuid",
        "123456789",
        "123e4567-e89b-12d3-a456", // too short
        "123e4567-e89b-12d3-a456-426614174000-extra", // too long
        "",
      ];
      invalidUuids.forEach((uuid) => {
        expect(() => idSchema.parse(uuid)).toThrow();
      });
    });
  });
  describe("emailSchema", () => {
    it("should accept valid email addresses", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "user+tag@example.org",
        "firstname.lastname@domain.com",
      ];
      validEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });
    it("should normalize email to lowercase", () => {
      const result = emailSchema.parse("TEST@EXAMPLE.COM");
      expect(result).toBe("test@example.com");
    });
    it("should trim whitespace", () => {
      const result = emailSchema.parse("  test@example.com  ");
      expect(result).toBe("test@example.com");
    });
    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "not-an-email",
        "@example.com",
        "test@",
        "test.example.com",
        "",
        "test@example",
      ];
      invalidEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).toThrow();
      });
    });
  });
  describe("Type exports", () => {
    it("should export correct types", () => {
      // Test that types can be used
      const constraints = {
        shortText: { min: 1, max: 100 },
        mediumText: { min: 1, max: 255 },
        longText: { min: 1, max: 1000 },
        veryLongText: { min: 1, max: 50000 },
        positiveInt: { min: 1 },
        pagination: { min: 0, max: 100 },
        tags: { minItems: 0, maxItems: 10, maxTagLength: 20 },
      };
      expect(constraints).toBeDefined();
    });
  });
});
