// app/api/uploadthing/route.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { createRouteHandler } from "uploadthing/next";

// 1) Router'ı burada tanımlıyoruz (tek dosya)
const f = createUploadthing();

/**
 * Uygulama içinde kullanacağımız tek endpoint:
 * - "themeImage": banner, ikon, görsel yükleme
 */
export const ourFileRouter = {
  themeImage: f({ image: { maxFileSize: "8MB" } }).onUploadComplete(async ({ file }) => {
    // Vercel log'larında görelim
    console.log("Uploaded:", file.url);
    // client tarafında kolay almak için url döndürüyoruz
    return { url: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// 2) App Router handler (GET/POST)
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // (opsiyonel) UploadThing token kullanıyorsan env'den geç
  config: { token: process.env.UPLOADTHING_TOKEN },
});