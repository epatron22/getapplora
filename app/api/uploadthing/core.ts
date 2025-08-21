// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Tema/banner/icon görselleri için tek endpoint
  themeImage: f({ image: { maxFileSize: "8MB" } })
    .onUploadComplete(async ({ file }) => {
      // Vercel loglarında görmek istersen:
      console.log("Uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;