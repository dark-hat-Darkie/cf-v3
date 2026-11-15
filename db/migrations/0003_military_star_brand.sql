CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'replied', 'archived');--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"project" varchar(80) DEFAULT '' NOT NULL,
	"budget" varchar(80) DEFAULT '' NOT NULL,
	"source" varchar(200) DEFAULT '' NOT NULL,
	"status" "inquiry_status" DEFAULT 'new' NOT NULL,
	"email_sent" boolean DEFAULT false NOT NULL,
	"ip_hash" varchar(64) DEFAULT '' NOT NULL,
	"user_agent" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "inquiries_status_idx" ON "inquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "inquiries_ip_idx" ON "inquiries" USING btree ("ip_hash","created_at");