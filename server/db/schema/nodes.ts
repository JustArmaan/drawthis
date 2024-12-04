import {
  integer,
  pgTable,
  json,
  text,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { projects } from "./projects";

export const nodes = pgTable("nodes", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  position: json("position").notNull(),
  data: json("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
