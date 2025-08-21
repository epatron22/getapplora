import { generateUploadButton } from "@uploadthing/react"; // veya gerekirse "@uploadthing/react/next"
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();