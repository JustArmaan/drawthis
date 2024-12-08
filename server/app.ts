import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { schemasRoute } from "./routes/diagrams";
import { tablesRoute } from "./routes/table-routes";

import { hc } from "hono/client";
import { authRoute } from "./routes/auth";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/", authRoute)
  .route("/schemas", schemasRoute)
  .route("/tables", tablesRoute);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
