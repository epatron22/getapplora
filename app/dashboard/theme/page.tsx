'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/* ------------ types ------------- */
type IconName = 'home'|'shopping_bag'|'person'|'favorite'|'search'|'info';
type Tab = { label: string; icon: IconName; url: string };
type ThemeDraft = {
  brand: { appName: string; primary: string; secondary: string };
  navigation: { tabs: Tab[] };
  home: { bannerImage: string; bannerLink: string; noticeText: string };
};

/* ----------- presets ------------ */
const SAMPLE_BANNERS = [
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1200&auto=format&fit=crop',
];
const COLOR_SWATCHES = ['#EA580C','#F59E0B','#0EA5E9','#22C55E','#8B5CF6','#EF4444','#0F172A','#111827','#FFFFFF'];

/* -------- helpers (renk) --------- */
function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function contrastOn(hex: string) {
  // YIQ kontrast: açık renklerde siyah yazı, koyularda beyaz yazı
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);
  const yiq = (r*299 + g*587 + b*114) / 1000;
  return yiq >= 186 ? '#111827' : '#ffffff'; // slate-900 ya da beyaz
}

/* ---------- initial draft --------- */
const initialDraft: ThemeDraft = {
  brand: { appName: 'Mağazam', primary: '#EA580C', secondary: '#F59E0B' },
  navigation: {
    tabs: [
      { label: 'Home',  icon: 'home',         url: 'https://ornek.com/' },
      { label: 'Shop',  icon: 'shopping_bag', url: 'https://ornek.com/kategori' },
      { label: 'Hesap', icon: 'person',       url: 'https://ornek.com/account' },
    ],
  },
  home: {
    bannerImage: SAMPLE_BANNERS[0],
    bannerLink: 'https://ornek.com',
    noticeText: 'Bugün %15 indirim!',
  },
};

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function ThemeEditor() {
  const [draft, setDraft] = useState<ThemeDraft>(initialDraft);

  useEffect(() => {
    const saved = localStorage.getItem('theme_draft');
    if (saved) setDraft(JSON.parse(saved) as ThemeDraft);
  }, []);

  const setBrand = (k: keyof ThemeDraft['brand'], v: string) =>
    setDraft(d => ({ ...d, brand: { ...d.brand, [k]: v } }));
  const setHome = (k: keyof ThemeDraft['home'], v: string) =>
    setDraft(d => ({ ...d, home: { ...d.home, [k]: v } }));
  const setTab = <K extends keyof Tab>(i: number, k: K, v: Tab[K]) =>
    setDraft(d => {
      const tabs = [...d.navigation.tabs];
      tabs[i] = { ...tabs[i], [k]: v };
      return { ...d, navigation: { tabs } };
    });
  const addTab = () =>
    setDraft(d => ({ ...d, navigation: { tabs: [...d.navigation.tabs, { label: 'Yeni', icon: 'info', url: 'https://ornek.com' }] } }));
  const removeTab = (i: number) =>
    setDraft(d => ({ ...d, navigation: { tabs: d.navigation.tabs.filter((_, idx) => idx !== i) } }));

  const saveDraft = () => { localStorage.setItem('theme_draft', JSON.stringify(draft)); alert('Taslak kaydedildi.'); };
  const publishDraft = () => { localStorage.setItem('theme_published', JSON.stringify(draft)); alert('Yayınlandı (demo).'); };
  const resetAll = () => { localStorage.removeItem('theme_draft'); localStorage.removeItem('theme_published'); setDraft(initialDraft); };

  // renkler
  const primary = draft.brand.primary;
  const secondary = draft.brand.secondary;
  const primaryText = contrastOn(primary);
  const secondaryText = contrastOn(secondary);

  return (
    <main className="min-h-screen bg-white">
      {/* header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
            <div className="font-semibold text-slate-900">Tema Editörü</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={saveDraft} className="h-9 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50">Taslağı Kaydet</button>
            <button onClick={publishDraft} className="h-9 rounded-xl px-4 text-sm font-semibold" style={{ background: primary, color: primaryText }}>
              Yayınla
            </button>
            <button onClick={resetAll} className="h-9 rounded-xl border border-red-300 px-3 text-sm font-semibold text-red-700 hover:bg-red-50">Sıfırla</button>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
        {/* left column */}
        <div className="space-y-8">
          {/* BRAND */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Marka</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm text-slate-800">Uygulama Adı</label>
                <input
                  value={draft.brand.appName}
                  onChange={(e) => setBrand('appName', e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3 text-slate-900 placeholder:text-slate-400"
                  placeholder="Mağaza adı"
                />
              </div>

              <ColorPicker label="Ana Renk (Primary)" value={primary} onChange={(val) => setBrand('primary', val)} />
              <ColorPicker label="İkincil Renk (Secondary)" value={secondary} onChange={(val) => setBrand('secondary', val)} />
            </div>
          </section>

          {/* NAVIGATION */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Alt Menü</h2>
              <button onClick={addTab} className="h-9 rounded-lg border border-slate-300 px-3 text-sm text-slate-900 hover:bg-slate-50">Sekme Ekle</button>
            </div>

            <div className="mt-4 space-y-4">
              {draft.navigation.tabs.map((t, i) => (
                <div key={i} className="grid gap-3 md:grid-cols-[1fr_160px_1fr_auto] items-end">
                  <div>
                    <label className="text-sm text-slate-800">Etiket</label>
                    <input value={t.label} onChange={(e) => setTab(i, 'label', e.target.value)}
                           className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3 text-slate-900" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-800">İkon</label>
                    <select value={t.icon} onChange={(e) => setTab(i, 'icon', e.target.value as IconName)}
                            className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3 text-slate-900">
                      <option value="home">home</option>
                      <option value="shopping_bag">shopping_bag</option>
                      <option value="person">person</option>
                      <option value="favorite">favorite</option>
                      <option value="search">search</option>
                      <option value="info">info</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-800">Hedef URL</label>
                    <input value={t.url} onChange={(e) => setTab(i, 'url', e.target.value)}
                           className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3 text-slate-900" placeholder="https://..." />
                  </div>
                  <div className="justify-self-end">
                    <button onClick={() => removeTab(i)} className="h-11 rounded-lg border border-slate-300 px-3 text-slate-900 hover:bg-slate-50">Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* HOME */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Ana Sayfa</h2>
            <div className="mt-4 grid gap-5">
              <div>
                <label className="text-sm text-slate-800">Banner Görseli (URL)</label>
                <input
                  value={draft.home.bannerImage}
                  onChange={(e) => setHome('bannerImage', e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3 text-slate-900"
                  placeholder="https://..."
                />
                <div className="mt-3 flex flex-wrap gap-3">
                  {SAMPLE_BANNERS.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setHome('bannerImage', src)}
                      className={cn(
                        'relative h-16 w-28 overflow-hidden rounded-xl border',
                        draft.home.bannerImage === src && 'ring-2 ring-offset-2 ring-amber-500'
                      )}
                      title="Bu görseli seç"
                    >
                      <Image src={src} alt="sample" fill sizes="112px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-slate-800">Banner Linki</label>
                  <input value={draft.home.bannerLink} onChange={(e) => setHome('bannerLink', e.target.value)}
                         className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3 text-slate-900" placeholder="https://..." />
                </div>
                <div>
                  <label className="text-sm text-slate-800">Duyuru Metni</label>
                  <input value={draft.home.noticeText} onChange={(e) => setHome('noticeText', e.target.value)}
                         className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3 text-slate-900" placeholder="Örn. Bugün %15 indirim!" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* right column — phone preview */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mx-auto max-w-sm">
            <div className="h-10 rounded-2xl flex items-center justify-center text-xs font-medium" style={{ background: hexToRgba(primary, .08), color: '#111827' }}>
              {draft.brand.appName} · Önizleme
            </div>

            <div className="mt-4 rounded-2xl overflow-hidden border" style={{ borderColor: hexToRgba('#000000', .08) }}>
              <Image
                src={draft.home.bannerImage}
                alt="banner"
                width={800}
                height={400}
                className="w-full h-40 object-cover"
              />
            </div>

            {/* Notice card: arka plan primary'nin %8 tonu, kenarlık primary, yazı koyu */}
            <div
              className="mt-4 text-sm rounded-xl border p-3"
              style={{ borderColor: primary, background: hexToRgba(primary, .08), color: '#111827' }}
            >
              <div className="font-semibold mb-1" style={{ color: primary }}>Duyuru</div>
              <div>{draft.home.noticeText}</div>
            </div>

            {/* Bottom nav mock */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              {draft.navigation.tabs.map((t, i) => (
                <div key={i} className="rounded-xl border px-2 py-3 text-center" style={{ borderColor: hexToRgba('#000000', .08) }}>
                  <div className="text-lg" style={{ color: secondary }}>✨</div>
                  <div className="font-medium text-slate-900">{t.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <a href={draft.home.bannerLink} target="_blank" className="underline text-sm text-slate-900">Banner linkini aç</a>
              <div className="flex items-center gap-2 text-xs">
                <span className="h-4 w-4 rounded border" style={{ background: primary, borderColor: hexToRgba('#000000', .2) }} />
                <span className="h-4 w-4 rounded border" style={{ background: secondary, borderColor: hexToRgba('#000000', .2) }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- ColorPicker component ---------------- */
function ColorPicker(props: { label: string; value: string; onChange: (val: string) => void }) {
  const { label, value, onChange } = props;

  return (
    <div>
      <label className="text-sm text-slate-800">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        {/* swatches */}
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => onChange(c)}
              className={cn(
                'h-8 w-8 rounded-md border',
                value.toLowerCase() === c.toLowerCase() && 'ring-2 ring-offset-2 ring-amber-500'
              )}
              style={{ background: c, borderColor: '#e5e7eb' }}
            />
          ))}
        </div>
        {/* native color input + hex */}
        <div className="flex items-center gap-2">
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-9 rounded border p-0" />
          <input value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-28 rounded-xl border border-slate-300 px-2 text-sm text-slate-900" />
        </div>
      </div>
    </div>
  );
}