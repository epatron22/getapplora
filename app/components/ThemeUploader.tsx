"use client";

import "@uploadthing/react/styles.css";
import { UploadButton } from "@/app/utils/uploadthing"; // <-- BURADAN GELİYOR

export default function ThemeUploader({
  onUploaded,
  text = "Görsel Yükle",
}: { onUploaded: (url: string) => void; text?: string }) {
  // ... üst kısım aynı
return (
  <div className="flex items-center gap-3">
    <UploadButton
      endpoint="themeImage"
      onClientUploadComplete={(res) => {
        const f = res?.[0] as { serverData?: { url?: string }; url?: string } | undefined;
        const url = f?.serverData?.url || f?.url;
        if (url) onUploaded(url);
      }}
      onUploadError={(e: Error) => alert(`Yüklenemedi: ${e.message}`)}
      appearance={{
        button: "h-9 rounded-xl border border-slate-300 px-4 text-sm hover:bg-slate-50",
        container: "ut-container",
        allowedContent: "text-xs text-slate-500",
      }}
      // ⬇️ bu blok eklendi: text artık kullanılıyor
      content={{
        button({ ready }) { return ready ? text : "Hazırlanıyor..."; },
        allowedContent({ ready, isUploading, fileTypes }) {
          if (!ready) return " ";
          if (isUploading) return "Yükleniyor…";
          return `Destek: ${fileTypes.join(", ")}`;
        },
      }}
    />
  </div>
);
// ...
}