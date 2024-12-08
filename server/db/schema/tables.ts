import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const schemas = pgTable("schemas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tables = pgTable(
  "tables",
  {
    id: serial("id").primaryKey(),
    label: text("label").notNull(),
    schemaId: integer("schema_id").notNull(),
    userId: text("user_id").notNull(),
    columns: jsonb("columns")
      .$type<
        Array<{
          name: string;
          type: string;
          primaryKey?: boolean;
          unique?: boolean;
        }>
      >()
      .notNull(),
    position: jsonb("position").$type<{ x: number; y: number }>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    schemaIdIndex: unique("schema_id_index").on(table.schemaId, table.userId),
  })
);

export const schemasRelations = relations(schemas, ({ many }) => ({
  tables: many(tables),
}));

export const tablesRelations = relations(tables, ({ one }) => ({
  schema: one(schemas, {
    fields: [tables.schemaId],
    references: [schemas.id],
  }),
}));

export const insertSchemaSchema = z.object({
  name: z.string(),
  userId: z.string(),
});

export const insertTableSchema = z.object({
  label: z.string(),
  schemaId: z.number(),
  userId: z.string(),
  columns: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      primaryKey: z.boolean().optional(),
      unique: z.boolean().optional(),
    })
  ),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});
