import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Next.js App Router export
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});