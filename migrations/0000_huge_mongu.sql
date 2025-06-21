CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."plan_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."plan_visibility" AS ENUM('private', 'public');--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" text,
	"color" varchar DEFAULT '#3B82F6',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_post_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"tag_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"featured_image" varchar,
	"author_id" varchar NOT NULL,
	"category_id" integer,
	"status" "blog_status" DEFAULT 'draft',
	"read_time" integer DEFAULT 5,
	"view_count" integer DEFAULT 0,
	"featured" boolean DEFAULT false,
	"seo_title" varchar(60),
	"seo_description" varchar(160),
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_tags_name_unique" UNIQUE("name"),
	CONSTRAINT "blog_tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "company_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"plan_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"base_price" integer NOT NULL,
	"coverage_amount" integer NOT NULL,
	"provider" varchar,
	"description" text,
	"features" jsonb,
	"rating" integer,
	"badge" varchar,
	"category_fields" jsonb NOT NULL,
	"deductible" integer,
	"exclusions" jsonb,
	"add_ons" jsonb,
	"tags" jsonb,
	"coverage" jsonb,
	"currency" varchar,
	"duration" varchar,
	"status" "plan_status" DEFAULT 'draft',
	"visibility" "plan_visibility" DEFAULT 'private',
	"marketplace_enabled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "company_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"country" varchar,
	"website" varchar,
	"logo" varchar,
	"marketplace_enabled" boolean DEFAULT false,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "context_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"memory_json" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"category" varchar(100),
	"input" text NOT NULL,
	"output" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insurance_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar NOT NULL,
	"provider" varchar(255) NOT NULL,
	"base_price" integer NOT NULL,
	"coverage_amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"country" varchar(2) NOT NULL,
	"benefits" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plan_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"comparisons" integer DEFAULT 0 NOT NULL,
	"conversions" integer DEFAULT 0 NOT NULL,
	"date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"category" varchar NOT NULL,
	"details" jsonb NOT NULL,
	"quote_reference" varchar,
	"status" varchar DEFAULT 'draft',
	"notification_sent" boolean DEFAULT false,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "quotes_quote_reference_unique" UNIQUE("quote_reference")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"destination" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"username" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"role" varchar DEFAULT 'user',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_tag_id_blog_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_plans" ADD CONSTRAINT "company_plans_company_id_company_profiles_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_profiles" ADD CONSTRAINT "company_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "context_snapshots" ADD CONSTRAINT "context_snapshots_conversation_id_conversation_logs_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_logs" ADD CONSTRAINT "conversation_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_analytics" ADD CONSTRAINT "plan_analytics_plan_id_company_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."company_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blog_post_tags_post_tag_idx" ON "blog_post_tags" USING btree ("post_id","tag_id");--> statement-breakpoint
CREATE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_posts_status_idx" ON "blog_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blog_posts_author_idx" ON "blog_posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "blog_posts_category_idx" ON "blog_posts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "blog_posts_published_at_idx" ON "blog_posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "company_plans_company_id_idx" ON "company_plans" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_plans_category_idx" ON "company_plans" USING btree ("category");--> statement-breakpoint
CREATE INDEX "context_snapshots_conv_id_idx" ON "context_snapshots" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "conv_logs_user_id_idx" ON "conversation_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "conv_logs_category_idx" ON "conversation_logs" USING btree ("category");--> statement-breakpoint
CREATE INDEX "plan_analytics_plan_id_idx" ON "plan_analytics" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "plan_analytics_date_idx" ON "plan_analytics" USING btree ("date");