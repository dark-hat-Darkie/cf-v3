import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  bigint,
  boolean,
  jsonb,
  serial,
  pgEnum,
  uniqueIndex,
  index,
  primaryKey,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { JSONContent } from "@tiptap/core";

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "scheduled",
  "published",
  "archived",
]);

export const schemaTypeEnum = pgEnum("schema_type", [
  "BlogPosting",
  "Article",
  "NewsArticle",
  "HowTo",
]);

export const twitterCardEnum = pgEnum("twitter_card", [
  "summary",
  "summary_large_image",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  bio: text("bio").notNull().default(""),
  role: varchar("role", { length: 120 }).notNull().default(""),
  avatarMediaId: integer("avatar_media_id").references((): AnyPgColumn => media.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 255 }).notNull(),
    attemptedAt: timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("login_attempts_key_idx").on(t.key, t.attemptedAt)],
);

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  blobUrl: text("blob_url").notNull(),
  pathname: text("pathname").notNull(),
  alt: text("alt").notNull().default(""),
  width: integer("width"),
  height: integer("height"),
  mime: varchar("mime", { length: 80 }).notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  blurhash: text("blurhash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
});

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: text("title").notNull().default(""),
    excerpt: text("excerpt").notNull().default(""),
    content: jsonb("content").$type<JSONContent>().notNull().default({ type: "doc", content: [] } as JSONContent),
    contentHtml: text("content_html").notNull().default(""),
    plainText: text("plain_text").notNull().default(""),
    status: postStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    revision: bigint("revision", { mode: "number" }).notNull().default(0),
    focusKeyword: text("focus_keyword").notNull().default(""),
    secondaryKeywords: jsonb("secondary_keywords").$type<string[]>().notNull().default([]),
    metaTitle: text("meta_title").notNull().default(""),
    metaDescription: text("meta_description").notNull().default(""),
    ogTitle: text("og_title").notNull().default(""),
    ogDescription: text("og_description").notNull().default(""),
    ogImageId: integer("og_image_id").references(() => media.id, { onDelete: "set null" }),
    twitterCard: twitterCardEnum("twitter_card").notNull().default("summary_large_image"),
    canonical: text("canonical").notNull().default(""),
    robotsIndex: boolean("robots_index").notNull().default(true),
    robotsFollow: boolean("robots_follow").notNull().default(true),
    schemaType: schemaTypeEnum("schema_type").notNull().default("BlogPosting"),
    schemaData: jsonb("schema_data").$type<Record<string, unknown>>().notNull().default({}),
    readingTimeMinutes: integer("reading_time_minutes").notNull().default(0),
    wordCount: integer("word_count").notNull().default(0),
    seoScore: integer("seo_score").notNull().default(0),
    readabilityScore: integer("readability_score").notNull().default(0),
    featuredImageId: integer("featured_image_id").references(() => media.id, { onDelete: "set null" }),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    isCornerstone: boolean("is_cornerstone").notNull().default(false),
  },
  (t) => [
    uniqueIndex("posts_slug_idx").on(t.slug),
    index("posts_status_idx").on(t.status, t.publishedAt),
    index("posts_focus_keyword_idx").on(t.focusKeyword),
  ],
);

export const postRevisions = pgTable(
  "post_revisions",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    revision: bigint("revision", { mode: "number" }).notNull(),
    title: text("title").notNull().default(""),
    content: jsonb("content").$type<JSONContent>().notNull(),
    savedAt: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
    label: text("label"),
  },
  (t) => [index("post_revisions_post_idx").on(t.postId, t.revision)],
);

export const postTags = pgTable(
  "post_tags",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
);

export const postCategories = pgTable(
  "post_categories",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.categoryId] })],
);

export const redirects = pgTable(
  "redirects",
  {
    id: serial("id").primaryKey(),
    fromPath: varchar("from_path", { length: 400 }).notNull().unique(),
    toPath: varchar("to_path", { length: 400 }).notNull(),
    status: integer("status").notNull().default(301),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("redirects_from_idx").on(t.fromPath)],
);

export const newsletterStatusEnum = pgEnum("newsletter_status", [
  "active",
  "unsubscribed",
]);

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    status: newsletterStatusEnum("status").notNull().default("active"),
    token: varchar("token", { length: 64 }).notNull().unique(),
    source: varchar("source", { length: 120 }).notNull().default(""),
    ipHash: varchar("ip_hash", { length: 64 }).notNull().default(""),
    userAgent: text("user_agent").notNull().default(""),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true }).notNull().defaultNow(),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("newsletter_email_idx").on(t.email),
    uniqueIndex("newsletter_token_idx").on(t.token),
    index("newsletter_status_idx").on(t.status),
  ],
);

export const seoSettings = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default(""),
  defaultOgImageId: integer("default_og_image_id").references(() => media.id, { onDelete: "set null" }),
  twitterHandle: text("twitter_handle").notNull().default(""),
  organizationSchema: jsonb("organization_schema").$type<Record<string, unknown>>().notNull().default({}),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  featuredImage: one(media, { fields: [posts.featuredImageId], references: [media.id], relationName: "featured" }),
  ogImage: one(media, { fields: [posts.ogImageId], references: [media.id], relationName: "og" }),
  revisions: many(postRevisions),
  tags: many(postTags),
  categories: many(postCategories),
}));

export const postRevisionsRelations = relations(postRevisions, ({ one }) => ({
  post: one(posts, { fields: [postRevisions.postId], references: [posts.id] }),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}));

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, { fields: [postCategories.postId], references: [posts.id] }),
  category: one(categories, { fields: [postCategories.categoryId], references: [categories.id] }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  posts: many(posts),
  sessions: many(sessions),
  avatar: one(media, { fields: [users.avatarMediaId], references: [media.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Media = typeof media.$inferSelect;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Redirect = typeof redirects.$inferSelect;
export type PostRevision = typeof postRevisions.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
