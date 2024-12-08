CREATE TABLE IF NOT EXISTS "nodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"position" json NOT NULL,
	"data" json NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "columns" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_table_id" integer NOT NULL,
	"target_table_id" integer NOT NULL,
	"type" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tables" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"schema_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"columns" jsonb NOT NULL,
	"position" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "schema_id_index" UNIQUE("schema_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schemas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nodes" ADD CONSTRAINT "nodes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "columns" ADD CONSTRAINT "columns_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relationships" ADD CONSTRAINT "relationships_source_table_id_tables_id_fk" FOREIGN KEY ("source_table_id") REFERENCES "public"."tables"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relationships" ADD CONSTRAINT "relationships_target_table_id_tables_id_fk" FOREIGN KEY ("target_table_id") REFERENCES "public"."tables"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
