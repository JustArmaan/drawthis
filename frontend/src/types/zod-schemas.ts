import { z } from "zod";

export const ColumnSchema = z.object({
  name: z.string().min(1, "Column name is required"),
  type: z.string().min(1, "Column type is required"),
});

export const TableNodeSchema = z.object({
  label: z.string().min(1, "Table name is required"),
  columns: z.array(ColumnSchema).min(1, "At least one column is required"),
});

export const RelationshipSchema = z.object({
  source: z.string(),
  target: z.string(),
  type: z.enum(["oneToOne", "oneToMany", "manyToMany"]),
});
