'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ThemeUploader from "../../components/ThemeUploader"; // en üst importlara ekle
/* ------------ types ------------- */
type IconName = 'home'|'shopping_bag'|'person'|'favorite'|'search'|'info';
type IconKind = 'builtin' | 'emoji' | 'image';
type Tab = {
  label: string;
  url: string;
  // ikon seçenekleri
  iconKind: IconKind;
  builtin?: IconName;
  emoji?: string;
  iconImage?: string;
};
type ThemeDraft = {
  brand: {
    appName: string;
    primary: string;
    secondary: string;
    textColor: string;     // yeni
    fontFamily: 'System'|'Inter'|'Roboto'|'Poppins'; // yeni
  };
  navigation: { tabs: Tab[] };
  home: { bannerImage: string; bannerLink: string; noticeText: string };
};
<div className="mt-2">
  <ThemeUploader
    text="Banner Yükle"
    onUploaded={(url) => setHome('bannerImage', url)}
  />
  <p className="mt-1 text-xs text-slate-500">JPG/PNG, max 2MB. Yüklendikten sonra adres otomatik dolar.</p>
</div>
/* ----------- presets ------------ */
const SAMPLE_BANNERS = [
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1200&auto=format&fit=crop',
];
const COLOR_SWATCHES = ['#111827','#000000','#374151','#6B7280','#EA580C','#F59E0B','#0EA5E9','#22C55E','#8B5CF6','#EF4444','#FFFFFF'];
const EMOJI_SET = ['🏠','🛍️','👤','❤️','🔎','ℹ️','⭐️','🔥','✨','🧁','🍫','🛒'];
// ---- MIGRATION: eski draft'ları yeni şemaya yükselt ----
function sanitizeHex(c?: string, fallback = '#111827') {
  if (typeof c !== 'string') return fallback;
  const m = c.trim();
  return /^#[0-9A-Fa-f]{6}$/.test(m) ? m : fallback;
}
function migrateDraft(raw: any): ThemeDraft {
  const d = raw ?? {};
  d.brand = d.brand ?? {};
  d.navigation = d.navigation ?? {};
  d.home = d.home ?? {};

  return {
    brand: {
      appName: typeof d.brand.appName === 'string' ? d.brand.appName : 'Mağazam',
      primary: sanitizeHex(d.brand.primary, '#EA580C'),
      secondary: sanitizeHex(d.brand.secondary, '#F59E0B'),
      textColor: sanitizeHex(d.brand.textColor, '#111827'), // <-- eksikse doldur
      fontFamily: ['System','Inter','Roboto','Poppins'].includes(d.brand.fontFamily)
        ? d.brand.fontFamily
        : 'System',
    },
    navigation: {
      tabs: Array.isArray(d.navigation.tabs) ? d.navigation.tabs.map((t: any) => ({
        label: typeof t?.label === 'string' ? t.label : 'Yeni',
        url: typeof t?.url === 'string' ? t.url : 'https://ornek.com',
        iconKind: t?.iconKind === 'image' || t?.iconKind === 'emoji' || t?.iconKind === 'builtin' ? t.iconKind : 'builtin',
        builtin: t?.builtin ?? 'home',
        emoji: typeof t?.emoji === 'string' ? t.emoji : '✨',
        iconImage: typeof t?.iconImage === 'string' ? t.iconImage : '',
      })) : [],
    },
    home: {
      bannerImage: typeof d.home.bannerImage === 'string' ? d.home.bannerImage : SAMPLE_BANNERS[0],
      bannerLink: typeof d.home.bannerLink === 'string' ? d.home.bannerLink : 'https://ornek.com',
      noticeText: typeof d.home.noticeText === 'string' ? d.home.noticeText : 'Bugün %15 indirim!',
    },
  };
}
/* -------- helpers (renk) --------- */
function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function contrastOn(hex: string) {
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);
  const yiq = (r*299 + g*587 + b*114) / 1000;
  return yiq >= 186 ? '#111827' : '#ffffff';
}
function cn(...parts: Array<string | false | undefined>) { return parts.filter(Boolean).join(' '); }

/* ---------- initial draft --------- */
const initialDraft: ThemeDraft = {
  brand: { appName: 'Mağazam', primary: '#EA580C', secondary: '#F59E0B', textColor: '#111827', fontFamily: 'System' },
  navigation: {
    tabs: [
      { label: 'Home',  url: 'https://ornek.com/',           iconKind: 'builtin', builtin: 'home' },
      { label: 'Shop',  url: 'https://ornek.com/kategori',   iconKind: 'builtin', builtin: 'shopping_bag' },
      { label: 'Hesap', url: 'https://ornek.com/account',    iconKind: 'builtin', builtin: 'person' },
    ],
    
  },
  home: {
    bannerImage: SAMPLE_BANNERS[0],
    bannerLink: 'https://ornek.com',
    noticeText: 'Bugün %15 indirim!',
  },
};

export default function ThemeEditor() {
  const [draft, setDraft] = useState<ThemeDraft>(initialDraft);

  useEffect(() => {
  try {
    const saved = localStorage.getItem('theme_draft');
    if (saved) {
      const parsed = JSON.parse(saved);
      setDraft(migrateDraft(parsed)); // <-- doğrudan parsed değil, migrate edilmiş hali
    }
  } catch {}
}, []);

  // setters
  const setBrand = <K extends keyof ThemeDraft['brand']>(k: K, v: ThemeDraft['brand'][K]) =>
    setDraft(d => ({ ...d, brand: { ...d.brand, [k]: v } }));
  const setHome = <K extends keyof ThemeDraft['home']>(k: K, v: ThemeDraft['home'][K]) =>
    setDraft(d => ({ ...d, home: { ...d.home, [k]: v } }));
  const setTab = <K extends keyof Tab>(i: number, k: K, v: Tab[K]) =>
    setDraft(d => { const tabs = [...d.navigation.tabs]; tabs[i] = { ...tabs[i], [k]: v }; return { ...d, navigation: { tabs } }; });
  const addTab = () => setDraft(d => ({ ...d, navigation: { tabs: [...d.navigation.tabs, { label:'Yeni', url:'https://ornek.com', iconKind:'emoji', emoji:'✨' }] } }));
  const removeTab = (i: number) => setDraft(d => ({ ...d, navigation: { tabs: d.navigation.tabs.filter((_, idx) => idx !== i) } }));

  const saveDraft = () => { localStorage.setItem('theme_draft', JSON.stringify(draft)); alert('Taslak kaydedildi.'); };
  const publishDraft = () => { localStorage.setItem('theme_published', JSON.stringify(draft)); alert('Yayınlandı (demo).'); };
  const resetAll = () => { localStorage.removeItem('theme_draft'); localStorage.removeItem('theme_published'); setDraft(initialDraft); };

  // renkler & font
  const { primary, secondary, textColor, fontFamily } = draft.brand;
  const primaryText = contrastOn(primary);
  const fontStack =
    fontFamily === 'Inter'   ? 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial' :
    fontFamily === 'Roboto'  ? 'Roboto, ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial' :
    fontFamily === 'Poppins' ? 'Poppins, ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial' :
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial';

  return (
    <main className="min-h-screen bg-white" style={{ color: textColor, fontFamily: fontStack }}>
      {/* header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur" style={{ color: textColor }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
            <div className="font-semibold">Tema Editörü</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={saveDraft} className="h-9 rounded-xl border px-4 text-sm font-semibold hover:bg-slate-50" style={{ borderColor: hexToRgba('#000',.15) }}>Taslağı Kaydet</button>
            <button onClick={publishDraft} className="h-9 rounded-xl px-4 text-sm font-semibold" style={{ background: primary, color: primaryText }}>Yayınla</button>
            <button onClick={resetAll} className="h-9 rounded-xl border px-3 text-sm font-semibold hover:bg-red-50" style={{ borderColor: hexToRgba('#000',.15), color:'#b91c1c' }}>Sıfırla</button>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
        {/* left column */}
        <div className="space-y-8">
          {/* BRAND */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: hexToRgba('#000',.1) }}>
            <h2 className="text-lg font-semibold">Marka</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm">Uygulama Adı</label>
                <input
                  value={draft.brand.appName}
                  onChange={(e) => setBrand('appName', e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border px-3"
                  style={{ borderColor: hexToRgba('#000',.15), color: textColor }}
                  placeholder="Mağaza adı"
                />
              </div>

              <ColorPicker label="Ana Renk (Primary)" value={primary} onChange={(val) => setBrand('primary', val)} />
              <ColorPicker label="İkincil Renk (Secondary)" value={secondary} onChange={(val) => setBrand('secondary', val)} />
              <ColorPicker label="Yazı Rengi" value={textColor} onChange={(val) => setBrand('textColor', val)} />

              <FontPicker
                label="Yazı Tipi (Font)"
                value={fontFamily}
                onChange={(val) => setBrand('fontFamily', val)}
              />
            </div>
          </section>

          {/* NAVIGATION */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: hexToRgba('#000',.1) }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Alt Menü</h2>
              <button onClick={addTab} className="h-9 rounded-lg border px-3 text-sm hover:bg-slate-50" style={{ borderColor: hexToRgba('#000',.15) }}>Sekme Ekle</button>
            </div>

            <div className="mt-4 space-y-6">
              {draft.navigation.tabs.map((t, i) => (
                <div key={i} className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-3">
                    <div>
                      <label className="text-sm">Etiket</label>
                      <input value={t.label} onChange={(e) => setTab(i, 'label', e.target.value)}
                             className="mt-1 w-full h-11 rounded-xl border px-3"
                             style={{ borderColor: hexToRgba('#000',.15), color: textColor }} />
                    </div>
                    <div>
                      <label className="text-sm">Hedef URL</label>
                      <input value={t.url} onChange={(e) => setTab(i, 'url', e.target.value)}
                             className="mt-1 w-full h-11 rounded-xl border px-3"
                             style={{ borderColor: hexToRgba('#000',.15), color: textColor }} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm">İkon Türü</label>
                    <div className="flex items-center gap-2">
                      <SegButton active={t.iconKind==='builtin'} onClick={() => setTab(i,'iconKind','builtin')}>Built-in</SegButton>
                      <SegButton active={t.iconKind==='emoji'} onClick={() => setTab(i,'iconKind','emoji')}>Emoji</SegButton>
                      <SegButton active={t.iconKind==='image'} onClick={() => setTab(i,'iconKind','image')}>Resim URL</SegButton>
                    </div>
                    <ThemeUploader
  text="İkon Yükle"
  onUploaded={(url) => setTab(i, 'iconImage', url)}
/>
<p className="text-xs text-slate-500">32×32 önerilir. Şeffaf PNG güzel durur.</p>

                    {t.iconKind === 'builtin' && (
                      <select
                        value={t.builtin ?? 'home'}
                        onChange={(e)=> setTab(i,'builtin', e.target.value as IconName)}
                        className="h-11 rounded-xl border px-3"
                        style={{ borderColor: hexToRgba('#000',.15), color: textColor }}
                      >
                        <option value="home">home</option>
                        <option value="shopping_bag">shopping_bag</option>
                        <option value="person">person</option>
                        <option value="favorite">favorite</option>
                        <option value="search">search</option>
                        <option value="info">info</option>
                      </select>
                    )}

                    {t.iconKind === 'emoji' && (
                      <div className="flex flex-wrap gap-2">
                        {EMOJI_SET.map(ej => (
                          <button
                            key={ej}
                            type="button"
                            onClick={()=> setTab(i,'emoji', ej)}
                            className={cn('h-10 w-10 rounded-lg border flex items-center justify-center text-lg',
                              (t.emoji ?? '') === ej && 'ring-2 ring-offset-2 ring-amber-500')}
                            style={{ borderColor: hexToRgba('#000',.15) }}
                            aria-label={`emoji-${ej}`}
                          >{ej}</button>
                        ))}
                      </div>
                    )}

                    {t.iconKind === 'image' && (
                      <div className="grid gap-2">
                        <input
                          value={t.iconImage ?? ''}
                          onChange={(e)=> setTab(i,'iconImage', e.target.value)}
                          className="h-11 rounded-xl border px-3"
                          style={{ borderColor: hexToRgba('#000',.15), color: textColor }}
                          placeholder="https://cdn.site.com/icon.png (32x32 önerilir)"
                        />
                        {(t.iconImage ?? '').startsWith('http') && (
                          <div className="h-10 w-10 relative overflow-hidden rounded border" style={{ borderColor: hexToRgba('#000',.15) }}>
                            <Image src={t.iconImage!} alt="icon" fill sizes="40px" className="object-contain" unoptimized />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button onClick={() => removeTab(i)} className="h-10 rounded-lg border px-3 hover:bg-slate-50" style={{ borderColor: hexToRgba('#000',.15) }}>
                      Sekmeyi Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* HOME */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: hexToRgba('#000',.1) }}>
            <h2 className="text-lg font-semibold">Ana Sayfa</h2>
            <div className="mt-4 grid gap-5">
              <div>
                <label className="text-sm">Banner Görseli (URL)</label>
                <input
                  value={draft.home.bannerImage}
                  onChange={(e) => setHome('bannerImage', e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border px-3"
                  style={{ borderColor: hexToRgba('#000',.15), color: textColor }}
                  placeholder="https://..."
                />
                <div className="mt-3 flex flex-wrap gap-3">
                  {SAMPLE_BANNERS.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setHome('bannerImage', src)}
                      className={cn('relative h-16 w-28 overflow-hidden rounded-xl border',
                        draft.home.bannerImage === src && 'ring-2 ring-offset-2 ring-amber-500')}
                      style={{ borderColor: hexToRgba('#000',.15) }}
                      title="Bu görseli seç"
                    >
                      <Image src={src} alt="sample" fill sizes="112px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm">Banner Linki</label>
                  <input value={draft.home.bannerLink} onChange={(e) => setHome('bannerLink', e.target.value)}
                         className="mt-1 w-full h-11 rounded-xl border px-3"
                         style={{ borderColor: hexToRgba('#000',.15), color: textColor }} placeholder="https://..." />
                </div>
                <div>
                  <label className="text-sm">Duyuru Metni</label>
                  <input value={draft.home.noticeText} onChange={(e) => setHome('noticeText', e.target.value)}
                         className="mt-1 w-full h-11 rounded-xl border px-3"
                         style={{ borderColor: hexToRgba('#000',.15), color: textColor }} placeholder="Örn. Bugün %15 indirim!" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* right column — phone preview */}
        <div className="rounded-3xl border bg-white p-4 shadow-sm" style={{ borderColor: hexToRgba('#000',.1) }}>
          <div className="mx-auto max-w-sm">
            <div className="h-10 rounded-2xl flex items-center justify-center text-xs font-medium"
                 style={{ background: hexToRgba(primary, .08) }}>
              {draft.brand.appName} · Önizleme
            </div>

            <div className="mt-4 rounded-2xl overflow-hidden border" style={{ borderColor: hexToRgba('#000', .08) }}>
              <Image
                src={draft.home.bannerImage}
                alt="banner"
                width={800}
                height={400}
                className="w-full h-40 object-cover"
              />
            </div>

            <div className="mt-4 text-sm rounded-xl border p-3"
                 style={{ borderColor: primary, background: hexToRgba(primary, .08) }}>
              <div className="font-semibold mb-1" style={{ color: primary }}>Duyuru</div>
              <div style={{ color: textColor }}>{draft.home.noticeText}</div>
            </div>

            {/* Bottom nav mock */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              {draft.navigation.tabs.map((t, i) => (
                <div key={i} className="rounded-xl border px-2 py-3 text-center" style={{ borderColor: hexToRgba('#000', .08), color: textColor }}>
                  <div className="h-6 flex items-center justify-center mb-1">
                    {t.iconKind === 'emoji' && <span className="text-lg">{t.emoji ?? '✨'}</span>}
                    {t.iconKind === 'image' && t.iconImage?.startsWith('http') && (
                      <span className="inline-block h-5 w-5 relative">
                        <Image src={t.iconImage} alt="icon" fill sizes="20px" className="object-contain" unoptimized />
                      </span>
                    )}
                    {t.iconKind === 'builtin' && <span className="text-lg" style={{ color: secondary }}>✨</span>}
                  </div>
                  <div className="font-medium">{t.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <a href={draft.home.bannerLink} target="_blank" className="underline text-sm">Banner linkini aç</a>
              <div className="flex items-center gap-2 text-xs">
                <span className="h-4 w-4 rounded border" style={{ background: primary, borderColor: hexToRgba('#000', .2) }} />
                <span className="h-4 w-4 rounded border" style={{ background: secondary, borderColor: hexToRgba('#000', .2) }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- components ---------------- */
function ColorPicker(props: { label: string; value: string; onChange: (val: string) => void }) {
  const { label, value, onChange } = props;
  const safe = typeof value === 'string' ? value : '#111827'; // <-- guard

  return (
    <div>
      <label className="text-sm">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => onChange(c)}
              className={
                'h-8 w-8 rounded-md border' + (safe.toLowerCase() === c.toLowerCase() ? ' ring-2 ring-offset-2 ring-amber-500' : '')
              }
              style={{ background: c, borderColor: 'rgba(0,0,0,.15)' }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input type="color" value={safe} onChange={(e) => onChange(e.target.value)} className="h-9 w-9 rounded border p-0" />
          <input value={safe} onChange={(e) => onChange(e.target.value)} className="h-9 w-32 rounded-xl border px-2 text-sm"
                 style={{ borderColor: 'rgba(0,0,0,.15)' }} />
        </div>
      </div>
    </div>
  );
}

function FontPicker(props: { label: string; value: ThemeDraft['brand']['fontFamily']; onChange: (v: ThemeDraft['brand']['fontFamily']) => void }) {
  const { label, value, onChange } = props;
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select
        value={value}
        onChange={(e)=> onChange(e.target.value as ThemeDraft['brand']['fontFamily'])}
        className="mt-2 h-11 w-full rounded-xl border px-3"
        style={{ borderColor: 'rgba(0,0,0,.15)' }}
      >
        <option value="System">System</option>
        <option value="Inter">Inter</option>
        <option value="Roboto">Roboto</option>
        <option value="Poppins">Poppins</option>
      </select>
      <p className="mt-1 text-xs opacity-70">Not: Özel font dosyaları daha sonra eklenecek. Şimdilik sistem + popüler web font stack.</p>
    </div>
  );
}

function SegButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-9 px-3 rounded-lg border text-sm',
        active ? 'bg-amber-50 border-amber-500 text-amber-700' : 'hover:bg-slate-50'
      )}
      style={{ borderColor: active ? undefined : 'rgba(0,0,0,.15)' }}
    >
      {children}
    </button>
  );
}

function setHome(arg0: string, url: string): void {
    throw new Error('Function not implemented.');
}
