import { pgTable, serial, varchar, timestamp, text, integer, boolean, jsonb, index, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base tables
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company profiles for business users
export const companyProfiles = pgTable("company_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  country: varchar("country"),
  website: varchar("website"),
  logo: varchar("logo"),
  marketplaceEnabled: boolean("marketplace_enabled").default(false),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type CompanyProfile = typeof companyProfiles.$inferSelect;
export const insertCompanyProfileSchema = createInsertSchema(companyProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCompanyProfile = z.infer<typeof insertCompanyProfileSchema>;

// Session storage table for authentication
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Insurance categories
export const INSURANCE_CATEGORIES = {
  TRAVEL: "travel",
  AUTO: "auto",
  PET: "pet",
  HEALTH: "health"
} as const;

export type InsuranceCategory = typeof INSURANCE_CATEGORIES[keyof typeof INSURANCE_CATEGORIES];

// Quote schemas
export const travelQuoteSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  destination: z.string().min(2, "Destination is required"),
  departureDate: z.date({ required_error: "Departure date is required" }),
  returnDate: z.date({ required_error: "Return date is required" }),
  travelers: z.number().min(1, "At least one traveler is required").max(10, "Maximum 10 travelers allowed"),
  activities: z.array(z.string()).optional(),
  coverageLevel: z.enum(["basic", "standard", "premium"]).optional(),
  includesMedical: z.boolean().optional(),
  includesCancellation: z.boolean().optional(),
  includesValuables: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  category: z.literal(INSURANCE_CATEGORIES.TRAVEL)
});

// Type definitions
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

export type TravelQuote = z.infer<typeof travelQuoteSchema>;

// Quote tables
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  category: varchar("category").notNull(),
  details: jsonb("details").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  status: varchar("status").default("draft"),
});

export type Quote = typeof quotes.$inferSelect;
export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

// Insurance plans
export interface BasePlanFields {
  id?: string;
  planId: string;
  name: string;
  basePrice: number;
  coverageAmount: number;
  provider?: string;
  category?: InsuranceCategory;
  rating?: number;
  reviews?: number;
  badge?: string;
  features?: string[];
  description?: string;
  currency?: string;
  duration?: string;
  deductible?: number;
  exclusions?: string[];
  addOns?: string[];
  tags?: string[];
  coverage?: Record<string, any>;
  status?: 'draft' | 'active' | 'archived';
}

export interface TravelPlan extends BasePlanFields {
  category: typeof INSURANCE_CATEGORIES.TRAVEL;
  destinations: string[];
  coversMedical: boolean;
  coversCancellation: boolean;
  coversValuables: boolean;
  maxTripDuration: number;
  provider: string;
  description?: string;
  features: string[];
}

export interface AutoPlan extends BasePlanFields {
  category: typeof INSURANCE_CATEGORIES.AUTO;
  vehicleTypes: string[];
  comprehensive: boolean;
  roadside: boolean;
  provider: string;
  description?: string;
  features: string[];
}

export interface PetPlan extends BasePlanFields {
  category: typeof INSURANCE_CATEGORIES.PET;
  petTypes: string[];
  coversIllness: boolean;
  coversAccident: boolean;
  provider: string;
  description?: string;
  features: string[];
}

export interface HealthPlan extends BasePlanFields {
  category: typeof INSURANCE_CATEGORIES.HEALTH;
  coversPreventive: boolean;
  coversEmergency: boolean;
  coversSpecialist: boolean;
  provider: string;
  description?: string;
  features: string[];
}

// Field type definitions for category-specific fields
export type TravelPlanFields = Pick<TravelPlan, 'destinations' | 'coversMedical' | 'coversCancellation' | 'coversValuables' | 'maxTripDuration'>;
export type AutoPlanFields = Pick<AutoPlan, 'vehicleTypes' | 'comprehensive' | 'roadside'>;
export type PetPlanFields = Pick<PetPlan, 'petTypes' | 'coversIllness' | 'coversAccident'>;
export type HealthPlanFields = Pick<HealthPlan, 'coversPreventive' | 'coversEmergency' | 'coversSpecialist'>;

export type InsurancePlan = TravelPlan | AutoPlan | PetPlan | HealthPlan;

// Database table for company insurance plans
export const planStatusEnum = pgEnum('plan_status', ['draft', 'active', 'archived']);
export const planVisibilityEnum = pgEnum('plan_visibility', ['private', 'public']);

export const companyPlans = pgTable("company_plans", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companyProfiles.id).notNull(),
  planId: varchar("plan_id").notNull(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  basePrice: integer("base_price").notNull(),
  coverageAmount: integer("coverage_amount").notNull(),
  provider: varchar("provider"),
  description: text("description"),
  features: jsonb("features"),
  rating: integer("rating"),
  badge: varchar("badge"),
  categoryFields: jsonb("category_fields").notNull(),
  deductible: integer("deductible"),
  exclusions: jsonb("exclusions"),
  addOns: jsonb("add_ons"),
  tags: jsonb("tags"),
  coverage: jsonb("coverage"),
  currency: varchar("currency"),
  duration: varchar("duration"),
  status: planStatusEnum("status").default('draft'),
  visibility: planVisibilityEnum("visibility").default('private'),
  marketplaceEnabled: boolean("marketplace_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    companyIdIdx: index("company_plans_company_id_idx").on(table.companyId),
    categoryIdx: index("company_plans_category_idx").on(table.category),
  }
});

export type CompanyPlan = typeof companyPlans.$inferSelect;
export const insertCompanyPlanSchema = createInsertSchema(companyPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCompanyPlan = z.infer<typeof insertCompanyPlanSchema>;

// Plan analytics table to store performance metrics
export const planAnalytics = pgTable("plan_analytics", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").references(() => companyPlans.id).notNull(),
  views: integer("views").default(0),
  comparisons: integer("comparisons").default(0),
  conversions: integer("conversions").default(0),
  date: timestamp("date").defaultNow(),
}, (table) => {
  return {
    planIdIdx: index("plan_analytics_plan_id_idx").on(table.planId),
    dateIdx: index("plan_analytics_date_idx").on(table.date),
  }
});

export type PlanAnalytic = typeof planAnalytics.$inferSelect;
export const insertPlanAnalyticSchema = createInsertSchema(planAnalytics).omit({
  id: true,
});
export type InsertPlanAnalytic = z.infer<typeof insertPlanAnalyticSchema>;

// Field labels for different plan categories
export const planFieldLabels: Record<InsuranceCategory, Record<string, string>> = {
  travel: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    destinations: "Covered Destinations",
    coversMedical: "Medical Coverage",
    coversCancellation: "Cancellation Coverage",
    coversValuables: "Valuables Coverage",
    maxTripDuration: "Maximum Trip Duration"
  },
  auto: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    vehicleTypes: "Covered Vehicle Types",
    comprehensive: "Comprehensive Coverage",
    roadside: "Roadside Assistance"
  },
  pet: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    petTypes: "Covered Pet Types",
    coversIllness: "Illness Coverage",
    coversAccident: "Accident Coverage"
  },
  health: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    coversPreventive: "Preventive Care",
    coversEmergency: "Emergency Care",
    coversSpecialist: "Specialist Coverage"
  }
};

// Blog schema
export const blogStatusEnum = pgEnum('blog_status', ['draft', 'published', 'archived']);

export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  color: varchar("color").default("#3B82F6"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogTags = pgTable("blog_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  slug: varchar("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: varchar("featured_image"),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  categoryId: integer("category_id").references(() => blogCategories.id),
  status: blogStatusEnum("status").default('draft'),
  readTime: integer("read_time").default(5),
  viewCount: integer("view_count").default(0),
  featured: boolean("featured").default(false),
  seoTitle: varchar("seo_title", { length: 60 }),
  seoDescription: varchar("seo_description", { length: 160 }),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    slugIdx: index("blog_posts_slug_idx").on(table.slug),
    statusIdx: index("blog_posts_status_idx").on(table.status),
    authorIdx: index("blog_posts_author_idx").on(table.authorId),
    categoryIdx: index("blog_posts_category_idx").on(table.categoryId),
    publishedAtIdx: index("blog_posts_published_at_idx").on(table.publishedAt),
  }
});

export const blogPostTags = pgTable("blog_post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id, { onDelete: 'cascade' }).notNull(),
  tagId: integer("tag_id").references(() => blogTags.id, { onDelete: 'cascade' }).notNull(),
}, (table) => {
  return {
    postTagIdx: index("blog_post_tags_post_tag_idx").on(table.postId, table.tagId),
  }
});

// Blog types
export type BlogCategory = typeof blogCategories.$inferSelect;
export type BlogTag = typeof blogTags.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type BlogPostTag = typeof blogPostTags.$inferSelect;

// Blog insert schemas
export const insertBlogCategorySchema = createInsertSchema(blogCategories).omit({
  id: true,
  createdAt: true,
});
export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;

export const insertBlogTagSchema = createInsertSchema(blogTags).omit({
  id: true,
  createdAt: true,
});
export type InsertBlogTag = z.infer<typeof insertBlogTagSchema>;

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
}).extend({
  tags: z.array(z.string()).optional(),
});
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Blog post with relations
export type BlogPostWithRelations = BlogPost & {
  author: User;
  category: BlogCategory | null;
  tags: BlogTag[];
};