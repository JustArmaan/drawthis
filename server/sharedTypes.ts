import { z } from "zod";

export const ColumnSchema = z.object({
  name: z.string().min(1, "Column name is required"),
  type: z.string().min(1, "Column type is required"),
  primaryKey: z.boolean().optional(),
  unique: z.boolean().optional(),
});

export const PositionSchema = z.object({
  x: z.number().min(0, "X cant be negative"),
  y: z.number().min(0, "Y cant be negative"),
});

export const SchemaCreateSchema = z.object({
  name: z.string().min(1, "Schema name is required"),
});

export const TableCreateSchema = z.object({
  label: z.string().min(1, "Table label is required"),
  columns: z.array(ColumnSchema),
  position: PositionSchema,
  schemaId: z.number(),
});

export type Column = z.infer<typeof ColumnSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type SchemaCreate = z.infer<typeof SchemaCreateSchema>;
export type TableCreate = z.infer<typeof TableCreateSchema>;

export interface Schema {
  id: number;
  name: string;
  userId?: string;
  createdAt: Date;
}

export interface Table {
  id: number;
  label: string;
  schemaId: number;
  userId: string;
  columns: Column[];
  position: Position;
  createdAt: Date;
}
