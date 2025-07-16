import { z } from "zod";

import {
  createArticleSchema,
  updateArticleSchema,
  getArticlesSchema,
  getFeedSchema,
  createCommentSchema,
  titleSchema,
  descriptionSchema,
  bodySchema,
  tagListSchema,
  validateCreateArticle,
  validateUpdateArticle,
  validateGetArticlesQuery,
  validateGetArticleFeedQuery,
  validateAddComment,
  validateGetCommentsQuery,
} from "../../src/validation/article";

describe("Article Validation Schemas", () => {
  describe("titleSchema", () => {
    it("should accept valid titles", () => {
      const validTitles = [
        "How to Learn TypeScript",
        "A",
        "a".repeat(100), // Max length
        "Title with 123 numbers",
        "Title-with-hyphens",
        "Title with special chars!@#",
      ];

      validTitles.forEach((title) => {
        expect(() => titleSchema.parse(title)).not.toThrow();
      });
    });

    it("should reject empty titles", () => {
      expect(() => titleSchema.parse("")).toThrow(z.ZodError);
      expect(() => titleSchema.parse("   ")).toThrow(z.ZodError);
    });

    it("should reject titles that are too long", () => {
      const tooLong = "a".repeat(201);
      expect(() => titleSchema.parse(tooLong)).toThrow(z.ZodError);
    });

    it("should trim whitespace from titles", () => {
      const title = "  Valid Title  ";
      const result = titleSchema.parse(title);
      expect(result).toBe("Valid Title");
    });
  });

  describe("descriptionSchema", () => {
    it("should accept valid descriptions", () => {
      const validDescriptions = [
        "A short description",
        "a".repeat(255), // Max length
        "Description with numbers 123",
        "Multi-line\ndescription",
        "Special chars !@#$%^&*()",
      ];

      validDescriptions.forEach((description) => {
        expect(() => descriptionSchema.parse(description)).not.toThrow();
      });
    });

    it("should reject empty descriptions", () => {
      expect(() => descriptionSchema.parse("")).toThrow(z.ZodError);
      expect(() => descriptionSchema.parse("   ")).toThrow(z.ZodError);
    });

    it("should reject descriptions that are too long", () => {
      const tooLong = "a".repeat(256);
      expect(() => descriptionSchema.parse(tooLong)).toThrow(z.ZodError);
    });

    it("should trim whitespace from descriptions", () => {
      const description = "  Valid description  ";
      const result = descriptionSchema.parse(description);
      expect(result).toBe("Valid description");
    });
  });

  describe("bodySchema", () => {
    it("should accept valid article bodies", () => {
      const validBodies = [
        "This is a valid article body.",
        "a".repeat(10000), // Large content
        "Body with\nmultiple\nlines",
        "Body with **markdown** and _formatting_",
        'Body with code ```js\nconsole.log("hello");\n```',
      ];

      validBodies.forEach((body) => {
        expect(() => bodySchema.parse(body)).not.toThrow();
      });
    });

    it("should reject empty bodies", () => {
      expect(() => bodySchema.parse("")).toThrow(z.ZodError);
      expect(() => bodySchema.parse("   ")).toThrow(z.ZodError);
    });

    it("should reject bodies that are too long", () => {
      const tooLong = "a".repeat(50001);
      expect(() => bodySchema.parse(tooLong)).toThrow(z.ZodError);
    });

    it("should trim whitespace from bodies", () => {
      const body = "  Valid article body  ";
      const result = bodySchema.parse(body);
      expect(result).toBe("Valid article body");
    });
  });

  describe("tagListSchema", () => {
    it("should accept valid tag lists", () => {
      const validTagLists = [
        [],
        ["javascript"],
        ["javascript", "typescript", "react"],
        ["a".repeat(20)], // Max tag length
        Array(10)
          .fill(0)
          .map((_, i) => `tag${i}`), // Max number of tags
        ["tag-with-hyphens", "tag_with_underscores"],
      ];

      validTagLists.forEach((tagList) => {
        expect(() => tagListSchema.parse(tagList)).not.toThrow();
      });
    });

    it("should reject too many tags", () => {
      const tooManyTags = Array(11).fill("tag");
      expect(() => tagListSchema.parse(tooManyTags)).toThrow(z.ZodError);
    });

    it("should reject tags that are too long", () => {
      const longTag = "a".repeat(21);
      expect(() => tagListSchema.parse([longTag])).toThrow(z.ZodError);
    });

    it("should reject empty tag strings", () => {
      expect(() => tagListSchema.parse([""])).toThrow(z.ZodError);
      expect(() => tagListSchema.parse(["valid", ""])).toThrow(z.ZodError);
    });

    it("should reject duplicate tags", () => {
      expect(() => tagListSchema.parse(["tag", "tag"])).toThrow(z.ZodError);
      expect(() =>
        tagListSchema.parse(["javascript", "react", "javascript"]),
      ).toThrow(z.ZodError);
    });

    it("should normalize tags to lowercase", () => {
      const tags = ["JavaScript", "REACT", "TypeScript"];
      const result = tagListSchema.parse(tags);
      expect(result).toEqual(["javascript", "react", "typescript"]);
    });
  });

  describe("createArticleSchema", () => {
    const validArticle = {
      title: "How to Learn TypeScript",
      description: "A comprehensive guide to TypeScript",
      body: "TypeScript is a typed superset of JavaScript...",
      tagList: ["typescript", "javascript"],
    };

    it("should accept valid article creation data", () => {
      expect(() =>
        createArticleSchema.parse({ article: validArticle }),
      ).not.toThrow();
    });

    it("should accept articles without tags", () => {
      const articleWithoutTags: any = { ...validArticle };
      delete articleWithoutTags.tagList;

      expect(() =>
        createArticleSchema.parse({ article: articleWithoutTags }),
      ).not.toThrow();
    });

    it("should validate all required fields", () => {
      const requiredFields = ["title", "description", "body"];

      requiredFields.forEach((field) => {
        const invalidArticle = { ...validArticle };
        delete invalidArticle[field as keyof typeof validArticle];

        expect(() =>
          createArticleSchema.parse({ article: invalidArticle }),
        ).toThrow(z.ZodError);
      });
    });

    it("should reject extra fields", () => {
      const articleWithExtra = {
        ...validArticle,
        extraField: "not allowed",
      };

      expect(() =>
        createArticleSchema.parse({ article: articleWithExtra }),
      ).toThrow(z.ZodError);
    });
  });

  describe("updateArticleSchema", () => {
    it("should accept partial updates", () => {
      const partialUpdates = [
        { article: { title: "New Title" } },
        { article: { description: "New description" } },
        { article: { body: "New body content" } },
        { article: { tagList: ["newtag"] } },
      ];

      partialUpdates.forEach((update) => {
        expect(() => updateArticleSchema.parse(update)).not.toThrow();
      });
    });

    it("should accept empty updates", () => {
      expect(() => updateArticleSchema.parse({ article: {} })).not.toThrow();
    });

    it("should validate fields when provided", () => {
      const invalidUpdates = [
        { article: { title: "" } },
        { article: { description: "" } },
        { article: { body: "" } },
        { article: { tagList: ["", "valid"] } },
      ];

      invalidUpdates.forEach((update) => {
        expect(() => updateArticleSchema.parse(update)).toThrow(z.ZodError);
      });
    });
  });

  describe("getArticlesSchema", () => {
    it("should accept valid query parameters", () => {
      const validQueries = [
        {},
        { tag: "javascript" },
        { author: "johndoe" },
        { favorited: "janedoe" },
        { limit: 20 },
        { offset: 10 },
        { tag: "react", author: "johndoe", limit: 5, offset: 0 },
      ];

      validQueries.forEach((query) => {
        expect(() => getArticlesSchema.parse(query)).not.toThrow();
      });
    });

    it("should validate limit constraints", () => {
      expect(() => getArticlesSchema.parse({ limit: 0 })).toThrow(z.ZodError);
      expect(() => getArticlesSchema.parse({ limit: 101 })).toThrow(z.ZodError);
      expect(() => getArticlesSchema.parse({ limit: 50 })).not.toThrow();
    });

    it("should validate offset constraints", () => {
      expect(() => getArticlesSchema.parse({ offset: -1 })).toThrow(z.ZodError);
      expect(() => getArticlesSchema.parse({ offset: 0 })).not.toThrow();
      expect(() => getArticlesSchema.parse({ offset: 100 })).not.toThrow();
    });

    it("should coerce string numbers to integers", () => {
      const result = getArticlesSchema.parse({ limit: "20", offset: "10" });
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(10);
    });
  });

  describe("getFeedSchema", () => {
    it("should accept valid feed parameters", () => {
      const validQueries = [
        {},
        { limit: 10 },
        { offset: 5 },
        { limit: 20, offset: 10 },
      ];

      validQueries.forEach((query) => {
        expect(() => getFeedSchema.parse(query)).not.toThrow();
      });
    });

    it("should apply default values", () => {
      const result = getFeedSchema.parse({});
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(0);
    });
  });

  describe("createCommentSchema", () => {
    it("should accept valid comment data", () => {
      const validComment = {
        body: "This is a great article!",
      };

      expect(() =>
        createCommentSchema.parse({ comment: validComment }),
      ).not.toThrow();
    });

    it("should reject empty comment bodies", () => {
      expect(() =>
        createCommentSchema.parse({ comment: { body: "" } }),
      ).toThrow(z.ZodError);
      expect(() =>
        createCommentSchema.parse({ comment: { body: "   " } }),
      ).toThrow(z.ZodError);
    });

    it("should reject comments that are too long", () => {
      const tooLong = "a".repeat(2001);
      expect(() =>
        createCommentSchema.parse({ comment: { body: tooLong } }),
      ).toThrow(z.ZodError);
    });

    it("should trim whitespace from comment bodies", () => {
      const comment = { body: "  Great article!  " };
      const result = createCommentSchema.parse({ comment });
      expect(result.comment.body).toBe("Great article!");
    });
  });

  describe("Validation Helper Functions", () => {
    describe("validateCreateArticle", () => {
      it("should return success for valid article data", () => {
        const validArticle = {
          title: "Test Article",
          description: "Test description",
          body: "Test body content",
          tagList: ["test", "article"],
        };

        const result = validateCreateArticle({ article: validArticle });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.article.title).toBe("Test Article");
        }
      });

      it("should return error for invalid article data", () => {
        const invalidArticle = {
          title: "", // empty title
          description: "",
          body: "",
        };

        const result = validateCreateArticle({ article: invalidArticle });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(0);
        }
      });
    });

    describe("validateUpdateArticle", () => {
      it("should return success for valid update data", () => {
        const validUpdate = {
          title: "Updated Title",
          body: "Updated body content",
        };

        const result = validateUpdateArticle({ article: validUpdate });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.article.title).toBe("Updated Title");
        }
      });

      it("should return success for empty update", () => {
        const result = validateUpdateArticle({ article: {} });

        expect(result.success).toBe(true);
      });
    });

    describe("validateGetArticlesQuery", () => {
      it("should return success for valid query parameters", () => {
        const validQuery = {
          tag: "javascript",
          limit: 10,
          offset: 0,
        };

        const result = validateGetArticlesQuery(validQuery);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.tag).toBe("javascript");
          expect(result.data.limit).toBe(10);
        }
      });

      it("should return success with defaults for empty query", () => {
        const result = validateGetArticlesQuery({});

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.limit).toBe(20); // default value
          expect(result.data.offset).toBe(0); // default value
        }
      });
    });

    describe("validateGetArticleFeedQuery", () => {
      it("should return success for valid feed query", () => {
        const validQuery = {
          limit: 15,
          offset: 5,
        };

        const result = validateGetArticleFeedQuery(validQuery);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.limit).toBe(15);
          expect(result.data.offset).toBe(5);
        }
      });
    });

    describe("validateAddComment", () => {
      it("should return success for valid comment data", () => {
        const validComment = {
          body: "This is a great article!",
        };

        const result = validateAddComment({ comment: validComment });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.comment.body).toBe("This is a great article!");
        }
      });

      it("should return error for invalid comment data", () => {
        const invalidComment = {
          body: "", // empty body
        };

        const result = validateAddComment({ comment: invalidComment });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(0);
        }
      });
    });

    describe("validateGetCommentsQuery", () => {
      it("should return success for valid comments query", () => {
        const validQuery = {
          limit: 10,
          offset: 0,
        };

        const result = validateGetCommentsQuery(validQuery);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.limit).toBe(10);
        }
      });
    });
  });
});
