CREATE TABLE IF NOT EXISTS "insurance_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar NOT NULL,
	"provider" varchar(255) NOT NULL,
	"base_price" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"country" varchar(2) NOT NULL,
	"benefits" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
); 