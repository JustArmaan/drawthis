import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { db } from "../db";
import { tables as tableTable, insertTableSchema } from "../db/schema/tables";
import { eq, desc, and } from "drizzle-orm";

export const tablesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    const schemaId = c.req.query("schemaId");

    if (!schemaId) {
      return c.json({ error: "Schema ID is required" }, 400);
    }

    const tables = await db
      .select()
      .from(tableTable)
      .where(
        and(
          eq(tableTable.userId, user.id),
          eq(tableTable.schemaId, Number(schemaId))
        )
      )
      .orderBy(desc(tableTable.createdAt));

    return c.json({ tables });
  })
  .post("/", getUser, zValidator("json", insertTableSchema), async (c) => {
    const user = c.var.user;
    const tableData = await c.req.valid("json");

    const validatedTable = insertTableSchema.parse({
      ...tableData,
      userId: user.id,
    });

    const result = await db
      .insert(tableTable)
      .values(validatedTable)
      .returning()
      .then((res) => res[0]);

    c.status(201);
    return c.json(result);
  })
  .put("/:id", getUser, zValidator("json", insertTableSchema), async (c) => {
    const user = c.var.user;
    const id = Number.parseInt(c.req.param("id"));
    const tableData = await c.req.valid("json");

    const validatedTable = insertTableSchema.parse({
      ...tableData,
      userId: user.id,
    });

    const result = await db
      .update(tableTable)
      .set(validatedTable)
      .where(and(eq(tableTable.id, id), eq(tableTable.userId, user.id)))
      .returning()
      .then((res) => res[0]);

    if (!result) {
      return c.notFound();
    }

    return c.json(result);
  })
  .delete("/:id", getUser, async (c) => {
    const user = c.var.user;
    const id = Number.parseInt(c.req.param("id"));

    const result = await db
      .delete(tableTable)
      .where(and(eq(tableTable.id, id), eq(tableTable.userId, user.id)))
      .returning()
      .then((res) => res[0]);

    if (!result) {
      return c.notFound();
    }

    return c.json(result);
  });
