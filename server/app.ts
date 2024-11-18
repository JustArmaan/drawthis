import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
// import { qrRoutes } from "./routes/qr-routes";
import { hc } from "hono/client";
import { authRoute } from "./routes/auth";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/", authRoute);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
