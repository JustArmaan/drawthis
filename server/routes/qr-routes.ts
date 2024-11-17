import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const qrSchema = z.object({
  url: z.string(),
});

let qrCodes: { id: string; url: string }[] = [];

export const qrRoutes = new Hono()
  .get("/", (c) => {
    // get all qr codes
    return c.json({ qrCodes });
  })
  .post(
    "/",
    zValidator(
      "json",
      qrSchema
    ),
    (c) => {

      const qrCode = {
        id: crypto.randomUUID(),
        url: c.req.valid("json").url,
      };
      qrCodes.push(qrCode);
      // create a qr code
      return c.json(
        {
          qrCode
        },
        201
      );
    }
  )
  .get("/:id", (c) => {
    // get a qr code by id
    const qrCode = qrCodes.find((qr) => qr.id === c.req.param("id"));
    if (!qrCode) {
      return c.json({ error: "QR code not found" }, 404);
    }
    return c.json({ qrCode });
  })
  .delete("/:id", (c) => {
    // delete a qr code by id
    const qrCode = qrCodes.find((qr) => qr.id === c.req.param("id"));
    if (!qrCode) {
      return c.json({ error: "QR code not found" }, 404);
    }
    qrCodes = qrCodes.filter((qr) => qr.id !== c.req.param("id"));
    c.status(204);
    return c.body(null);
  });
