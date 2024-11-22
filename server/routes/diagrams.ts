// import { Hono } from "hono";
// import { zValidator } from "@hono/zod-validator";
// import { getUser } from "../kinde";

// let nodesDb: Node[] = [];

// interface Node {
//   id: string;
//   userId: string;
//   name: string;
//   type: string;
//   position: { x: number; y: number };
//   data: any;
// }

// interface CreateNodeRequest {
//   name: string;
//   type: string;
//   position: { x: number; y: number };
//   data: any;
// }

// const createNodeSchema = {
//   name: "string",
//   type: "string",
//   position: {
//     x: "number",
//     y: "number",
//   },
//   data: "object",
// };

// export const nodesRoute = new Hono()
//   .get("/", getUser, async (c) => {
//     const user = c.var.user;

//     const nodes = nodesDb.filter((node) => node.userId === user.id);

//     return c.json({ nodes });
//   })
//     .post(
//         "/",
//         getUser,
//         zValidator("json", createNodeSchema),
//         async (c) => {
//         const user = c.var.user;
//         const { name, type, position, data } = c.req.valid("json") as CreateNodeRequest;

//         const node = {
//             id: uuidv4(),
//             userId: user.id,
//             name,
//             type,
//             position,
//             data,
//         };

//         nodesDb.push(node);

//         return c.json({ node }, 201);
//         }
//     )

// function uuidv4() {
//     throw new Error("Function not implemented.");
// }
