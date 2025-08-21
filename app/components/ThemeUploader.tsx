'use client';
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function ThemeUploader({
  onUploaded,
  text = "Görsel Yükle",
}: { onUploaded: (url: string) => void; text?: string }) {
  return (
    <div className="flex items-center gap-3">
      <UploadButton<OurFileRouter>
        endpoint="themeImage"
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.serverData?.url || res?.[0]?.url;
          if (url) onUploaded(url);
        }}
        onUploadError={(e: Error) => alert(`Yüklenemedi: ${e.message}`)}
        content={{
          button({ ready }) {
            return ready ? text : "Hazırlanıyor...";
          },
          allowedContent({ ready, fileTypes, isUploading }) {
            if (!ready) return " ";
            if (isUploading) return "Yükleniyor…";
            return `Destek: ${fileTypes.join(", ")}`;
          },
        }}
        appearance={{
          button: "h-9 rounded-xl border border-slate-300 px-4 text-sm hover:bg-slate-50",
          container: "ut-container",
          allowedContent: "text-xs text-slate-500",
        }}
      />
    </div>
  );
}