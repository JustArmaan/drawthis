import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { db } from "../db";
import {
  schemas as schemaTable,
  tables as tableTable,
  insertSchemaSchema,
  insertTableSchema,
} from "../db/schema/tables";
import { eq, desc, and, sql } from "drizzle-orm";

export const schemasRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    const schemas = await db
      .select({
        id: schemaTable.id,
        name: schemaTable.name,
        createdAt: schemaTable.createdAt,
        tablesCount: sql`(
          SELECT count(*)
          FROM ${tableTable}
          WHERE ${eq(tableTable.schemaId, schemaTable.id)}
        )`.as("tablesCount"),
      })
      .from(schemaTable)
      .where(eq(schemaTable.userId, user.id))
      .orderBy(desc(schemaTable.createdAt));

    return c.json({ schemas });
  })
  .post("/", getUser, zValidator("json", insertSchemaSchema), async (c) => {
    const user = c.var.user;
    const schemaData = await c.req.valid("json");

    const validatedSchema = insertSchemaSchema.parse({
      ...schemaData,
      userId: user.id,
    });

    const result = await db
      .insert(schemaTable)
      .values(validatedSchema)
      .returning()
      .then((res) => res[0]);

    c.status(201);
    return c.json(result);
  });
