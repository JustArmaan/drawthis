import {
  pgTable,
  serial,
  varchar,
  integer,
  real,
  timestamp,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("created_at").defaultNow(),
});

export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  positionX: real("position_x").notNull(),
  positionY: real("position_y").notNull(),
});

export const columns = pgTable("columns", {
  id: serial("id").primaryKey(),
  tableId: integer("table_id")
    .notNull()
    .references(() => tables.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
});

export const relationships = pgTable("relationships", {
  id: serial("id").primaryKey(),
  sourceTableId: integer("source_table_id")
    .notNull()
    .references(() => tables.id, { onDelete: "cascade" }),
  targetTableId: integer("target_table_id")
    .notNull()
    .references(() => tables.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(),
});
