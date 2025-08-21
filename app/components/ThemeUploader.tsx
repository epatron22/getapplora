"use client";

import "@uploadthing/react/styles.css";
import { UploadButton } from "@/app/utils/uploadthing"; // <-- BURADAN GELİYOR

export default function ThemeUploader({
  onUploaded,
  text = "Görsel Yükle",
}: { onUploaded: (url: string) => void; text?: string }) {
  return (
    <div className="flex items-center gap-3">
      <UploadButton
        endpoint="themeImage"
        onClientUploadComplete={(res) => {
          const file = res?.[0] as { serverData?: { url?: string }; url?: string } | undefined;
          const url = file?.serverData?.url || file?.url;
          if (url) onUploaded(url);
        }}
        onUploadError={(e: Error) => alert(`Yüklenemedi: ${e.message}`)}
        appearance={{
          button: "h-9 rounded-xl border border-slate-300 px-4 text-sm hover:bg-slate-50",
          container: "ut-container",
          allowedContent: "text-xs text-slate-500",
        }}
      />
    </div>
  );
}