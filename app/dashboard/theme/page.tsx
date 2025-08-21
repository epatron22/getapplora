'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ThemeUploader from '../../components/ThemeUploader';

/* ===== Types ===== */
type IconName = 'home'|'shopping_bag'|'person'|'favorite'|'search'|'info';
type IconKind = 'builtin' | 'emoji' | 'image';
type FontFamily = (typeof FONT_OPTIONS)[number];

type Tab = {
  label: string; url: string; iconKind: IconKind;
  builtin?: IconName; emoji?: string; iconImage?: string;
};
type ThemeDraft = {
  brand: { appName: string; primary: string; secondary: string; textColor: string; fontFamily: FontFamily };
  navigation: { tabs: Tab[] };
  home: { bannerImage: string; bannerLink: string; noticeText: string };
  site: { url: string }; // 🔹 yeni: webview
};

/* ===== Presets ===== */
const SAMPLE_BANNERS = [
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1200&auto=format&fit=crop',
] as const;

const COLOR_SWATCHES = ['#111827','#000000','#374151','#6B7280','#EA580C','#F59E0B','#0EA5E9','#22C55E','#8B5CF6','#EF4444','#FFFFFF'] as const;
const EMOJI_SET = ['🏠','🛍️','👤','❤️','🔎','ℹ️','⭐️','🔥','✨','🧁','🍫','🛒'] as const;
const FONT_OPTIONS = ['System','Inter','Roboto','Poppins'] as const;

/* ===== Helpers ===== */
const isString = (v: unknown): v is string => typeof v === 'string';
const cn = (...p: Array<string | false | undefined>) => p.filter(Boolean).join(' ');
const hexToRgba = (hex: string, a = 1) => {
  const h = hex.replace('#',''); const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16); const b = parseInt(h.slice(4,6),16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
const contrastOn = (hex: string) => {
  const h = hex.replace('#',''), r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  return (r*299 + g*587 + b*114)/1000 >= 186 ? '#111827' : '#ffffff';
};
const sanitizeHex = (c: unknown, fb = '#111827') => isString(c) && /^#[\da-fA-F]{6}$/.test(c.trim()) ? c.trim() : fb;
const normalizeUrl = (u: string) => {
  try { const url = new URL(u.startsWith('http') ? u : `https://${u}`); return url.toString(); }
  catch { return ''; }
};
const fontStackOf = (f: FontFamily) =>
  f==='Inter' ? 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial'
: f==='Roboto'? 'Roboto, ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial'
: f==='Poppins'? 'Poppins, ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial'
: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial';

/** localStorage’den eski kayıtları yeni şemaya yükselt */
function migrateDraft(raw: unknown): ThemeDraft {
  const d = (raw ?? {}) as Record<string, unknown>;
  const brand = (d.brand as Record<string, unknown>) ?? {};
  const navigation = (d.navigation as Record<string, unknown>) ?? {};
  const home = (d.home as Record<string, unknown>) ?? {};
  const site = (d.site as Record<string, unknown>) ?? {};

  const tabsUnknown = Array.isArray(navigation.tabs) ? (navigation.tabs as unknown[]) : [];

  const fontCandidate = brand.fontFamily;
  const fontFamily: FontFamily = (FONT_OPTIONS as readonly string[]).includes(String(fontCandidate))
    ? (fontCandidate as FontFamily) : 'System';

  return {
    brand: {
      appName: isString(brand.appName) ? brand.appName : 'Mağazam',
      primary: sanitizeHex(brand.primary, '#EA580C'),
      secondary: sanitizeHex(brand.secondary, '#F59E0B'),
      textColor: sanitizeHex(brand.textColor, '#111827'),
      fontFamily,
    },
    navigation: {
      tabs: tabsUnknown.map((t) => {
        const tr = (t ?? {}) as Record<string, unknown>;
        const kindRaw = tr.iconKind;
        const iconKind: IconKind = kindRaw==='image'||kindRaw==='emoji'||kindRaw==='builtin' ? (kindRaw as IconKind) : 'builtin';
        return {
          label: isString(tr.label) ? tr.label : 'Yeni',
          url: isString(tr.url) ? tr.url : 'https://ornek.com',
          iconKind,
          builtin: (tr.builtin as IconName) ?? 'home',
          emoji: isString(tr.emoji) ? tr.emoji : '✨',
          iconImage: isString(tr.iconImage) ? tr.iconImage : '',
        };
      }),
    },
    home: {
      bannerImage: isString(home.bannerImage) ? home.bannerImage : SAMPLE_BANNERS[0],
      bannerLink: isString(home.bannerLink) ? home.bannerLink : 'https://ornek.com',
      noticeText: isString(home.noticeText) ? home.noticeText : 'Bugün %15 indirim!',
    },
    site: { url: isString(site.url) ? site.url : '' },
  };
}

/* ===== Initial ===== */
const initialDraft: ThemeDraft = {
  brand: { appName: 'Mağazam', primary: '#EA580C', secondary: '#F59E0B', textColor: '#111827', fontFamily: 'System' },
  navigation: { tabs: [
    { label:'Home', url:'https://ornek.com', iconKind:'builtin', builtin:'home' },
    { label:'Shop', url:'https://ornek.com/kategori', iconKind:'builtin', builtin:'shopping_bag' },
    { label:'Hesap', url:'https://ornek.com/account', iconKind:'builtin', builtin:'person' },
  ]},
  home: { bannerImage: SAMPLE_BANNERS[0], bannerLink:'https://ornek.com', noticeText:'Bugün %15 indirim!' },
  site: { url: 'https://www.arslanzade.com.tr/' }, // örnek
};

/* ================= Page ================= */
export default function ThemeEditor() {
  const [draft, setDraft] = useState<ThemeDraft>(initialDraft);
  const [webUrl, setWebUrl] = useState<string>(initialDraft.site.url);
  const [frameKey, setFrameKey] = useState<number>(0); // reload için
  const [frameBlocked, setFrameBlocked] = useState<boolean>(false);
  const loadTimer = useRef<NodeJS.Timeout | null>(null);

  // localStorage’tan yükle (UI renkleri etkilenmiyor)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme_draft');
      if (saved) {
        const md = migrateDraft(JSON.parse(saved));
        setDraft(md);
        setWebUrl(md.site.url || initialDraft.site.url);
      }
    } catch {}
    return () => { if (loadTimer.current) clearTimeout(loadTimer.current); };
  }, []);

  /* setters */
  const setBrand = <K extends keyof ThemeDraft['brand']>(k: K, v: ThemeDraft['brand'][K]) =>
    setDraft(d => ({ ...d, brand: { ...d.brand, [k]: v } }));
  const setHome  = <K extends keyof ThemeDraft['home']>(k: K, v: ThemeDraft['home'][K]) =>
    setDraft(d => ({ ...d, home: { ...d.home, [k]: v } }));
  const setTab   = <K extends keyof Tab>(i: number, k: K, v: Tab[K]) =>
    setDraft(d => { const tabs = [...d.navigation.tabs]; tabs[i] = { ...tabs[i], [k]: v }; return { ...d, navigation: { tabs } }; });

  const addTab = () => setDraft(d => ({ ...d, navigation: { tabs: [...d.navigation.tabs, { label:'Yeni', url:'https://ornek.com', iconKind:'emoji', emoji:'✨' }] } }));
  const removeTab = (i: number) => setDraft(d => ({ ...d, navigation: { tabs: d.navigation.tabs.filter((_,idx)=>idx!==i) } }));

  /* actions */
  const saveDraft = () => { localStorage.setItem('theme_draft', JSON.stringify({ ...draft, site:{ url: webUrl } })); alert('Taslak kaydedildi.'); };
  const publishDraft = () => { localStorage.setItem('theme_published', JSON.stringify({ ...draft, site:{ url: webUrl } })); alert('Yayınlandı (demo).'); };
  const resetAll = () => {
    localStorage.removeItem('theme_draft'); localStorage.removeItem('theme_published');
    setDraft(initialDraft); setWebUrl(initialDraft.site.url); setFrameKey(k=>k+1); setFrameBlocked(false);
  };

  /* Preview‑only theme values (UI’yi etkilemesin) */
  const { primary, secondary, textColor, fontFamily } = draft.brand;
  const previewVars = {
    '--ap-primary': primary,
    '--ap-secondary': secondary,
    '--ap-text': textColor,
    '--ap-text-on-primary': contrastOn(primary),
    '--ap-font': fontStackOf(fontFamily),
  } as React.CSSProperties;

  /* iframe load bloklandıysa (X-Frame-Options / CSP), uyarı göster */
  const onFrameLoad = () => { if (loadTimer.current) clearTimeout(loadTimer.current); setFrameBlocked(false); };
  const tryLoad = () => {
    setFrameBlocked(false);
    setFrameKey(k => k + 1);
    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setFrameBlocked(true), 2500);
  };

  return (
    // ⚠️ UI renkleri sabit (slate). Buraya theme rengi uygulanmıyor.
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
            <div className="font-semibold">Tema Editörü</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={saveDraft} className="h-9 rounded-xl border px-4 text-sm font-semibold hover:bg-slate-50 border-slate-300">Taslağı Kaydet</button>
            <button onClick={publishDraft} className="h-9 rounded-xl px-4 text-sm font-semibold" style={{ background: primary, color: contrastOn(primary) }}>Yayınla</button>
            <button onClick={resetAll} className="h-9 rounded-xl border px-3 text-sm font-semibold hover:bg-red-50 border-slate-300 text-red-700">Sıfırla</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-8">
        {/* LEFT – Formlar (sabit slate UI) */}
        <div className="space-y-8">
          {/* Site URL */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Webview</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto] items-end">
              <div>
                <label className="text-sm">Site adresi</label>
                <input
                  value={webUrl}
                  onChange={(e)=> setWebUrl(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3"
                  placeholder="https://magazan.com"
                />
              </div>
              <button onClick={tryLoad} className="h-11 rounded-xl border border-slate-300 px-4 hover:bg-slate-50">Yenile</button>
              <a href={normalizeUrl(webUrl) || '#'} target="_blank" className="h-11 rounded-xl border border-slate-300 px-4 hover:bg-slate-50 flex items-center justify-center">
                Yeni sekmede aç
              </a>
            </div>
            <p className="mt-2 text-xs text-slate-500">Not: Bazı siteler güvenlik nedeniyle iframe’e izin vermez (X‑Frame‑Options/CSP). Engellenirse sağdaki telefonda uyarı çıkar.</p>
          </section>

          {/* MARKA */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Marka</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm">Uygulama Adı</label>
                <input value={draft.brand.appName} onChange={(e)=> setBrand('appName', e.target.value)} className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3" placeholder="Mağaza adı" />
              </div>
              <ColorPicker label="Ana Renk (Primary)" value={primary} onChange={(v)=> setBrand('primary', v)} />
              <ColorPicker label="İkincil Renk (Secondary)" value={secondary} onChange={(v)=> setBrand('secondary', v)} />
              <ColorPicker label="Yazı Rengi" value={textColor} onChange={(v)=> setBrand('textColor', v)} />
              <FontPicker label="Yazı Tipi (Font)" value={fontFamily} onChange={(v)=> setBrand('fontFamily', v)} />
            </div>
          </section>

          {/* NAV */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Alt Menü</h2>
              <button onClick={addTab} className="h-9 rounded-lg border border-slate-300 px-3 text-sm hover:bg-slate-50">Sekme Ekle</button>
            </div>
            <div className="mt-4 space-y-6">
              {draft.navigation.tabs.map((t, i) => (
                <div key={i} className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-3">
                    <div>
                      <label className="text-sm">Etiket</label>
                      <input value={t.label} onChange={(e)=> setTab(i,'label', e.target.value)} className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3" />
                    </div>
                    <div>
                      <label className="text-sm">Hedef URL</label>
                      <input value={t.url} onChange={(e)=> setTab(i,'url', e.target.value)} className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3" placeholder="https://..." />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm">İkon Türü</label>
                    <div className="flex items-center gap-2">
                      <SegButton active={t.iconKind==='builtin'} onClick={()=> setTab(i,'iconKind','builtin')}>Built‑in</SegButton>
                      <SegButton active={t.iconKind==='emoji'} onClick={()=> setTab(i,'iconKind','emoji')}>Emoji</SegButton>
                      <SegButton active={t.iconKind==='image'} onClick={()=> setTab(i,'iconKind','image')}>Resim URL</SegButton>
                    </div>

                    {t.iconKind === 'builtin' && (
                      <select value={t.builtin ?? 'home'} onChange={(e)=> setTab(i,'builtin', e.target.value as IconName)} className="h-11 rounded-xl border border-slate-300 px-3">
                        <option value="home">home</option><option value="shopping_bag">shopping_bag</option><option value="person">person</option>
                        <option value="favorite">favorite</option><option value="search">search</option><option value="info">info</option>
                      </select>
                    )}

                    {t.iconKind === 'emoji' && (
                      <div className="flex flex-wrap gap-2">
                        {EMOJI_SET.map(ej => (
                          <button key={ej} type="button" onClick={()=> setTab(i,'emoji', ej)}
                            className={cn('h-10 w-10 rounded-lg border border-slate-300 flex items-center justify-center text-lg',
                              (t.emoji ?? '') === ej && 'ring-2 ring-offset-2 ring-amber-500')}
                            aria-label={`emoji-${ej}`}>{ej}</button>
                        ))}
                      </div>
                    )}

                    {t.iconKind === 'image' && (
                      <div className="grid gap-2">
                        <input value={t.iconImage ?? ''} onChange={(e)=> setTab(i,'iconImage', e.target.value)}
                          className="h-11 rounded-xl border border-slate-300 px-3" placeholder="https://cdn.site.com/icon.png (32x32)" />
                        <ThemeUploader text="İkon Yükle" onUploaded={(url)=> setTab(i,'iconImage',url)} />
                        {(t.iconImage ?? '').startsWith('http') && (
                          <div className="h-10 w-10 relative overflow-hidden rounded border border-slate-300">
                            <Image src={t.iconImage!} alt="icon" fill sizes="40px" className="object-contain" unoptimized />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button onClick={()=> removeTab(i)} className="h-10 rounded-lg border border-slate-300 px-3 hover:bg-slate-50">Sekmeyi Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* HOME (banner vs – preview tarafında da kullanılır) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Ana Sayfa</h2>
            <div className="mt-4 grid gap-5">
              <div>
                <label className="text-sm">Banner Görseli (URL)</label>
                <input value={draft.home.bannerImage} onChange={(e)=> setHome('bannerImage', e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3" placeholder="https://..." />
                <div className="mt-2"><ThemeUploader text="Banner Yükle" onUploaded={(url)=> setHome('bannerImage', url)} />
                  <p className="mt-1 text-xs text-slate-500">JPG/PNG, max 4MB.</p></div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {SAMPLE_BANNERS.map((src)=>(
                    <button key={src} type="button" onClick={()=> setHome('bannerImage', src)}
                      className={cn('relative h-16 w-28 overflow-hidden rounded-xl border border-slate-300',
                        draft.home.bannerImage === src && 'ring-2 ring-offset-2 ring-amber-500')}>
                      <Image src={src} alt="sample" fill sizes="112px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm">Banner Linki</label>
                  <input value={draft.home.bannerLink} onChange={(e)=> setHome('bannerLink', e.target.value)}
                    className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3" placeholder="https://..." />
                </div>
                <div>
                  <label className="text-sm">Duyuru Metni</label>
                  <input value={draft.home.noticeText} onChange={(e)=> setHome('noticeText', e.target.value)}
                    className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3" placeholder="Örn. Bugün %15 indirim!" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT – Telefon çerçevesi + Webview + App preview */}
        <div className="space-y-4">
          {/* Telefon Frame + Webview */}
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Webview Önizleme</h3>
            <PhoneFrame>
              {(normalizeUrl(webUrl)) ? (
                <iframe
                  key={frameKey}
                  src={normalizeUrl(webUrl)}
                  className="h-full w-full rounded-[32px] bg-white"
                  sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                  onLoad={onFrameLoad}
                />
              ) : (
                <FrameFallback text="Geçerli bir URL girin" />
              )}
              {frameBlocked && <FrameFallback text="Site iframe’e izin vermiyor (X-Frame-Options/CSP). Yeni sekmede açıp kontrol edin." />}
            </PhoneFrame>
            <div className="mt-2 text-xs text-slate-500">Boyut: 390×844 (iPhone 14 Pro).</div>
          </section>

          {/* App mock preview – sadece burada tema renkleri uygulanır */}
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Uygulama Önizleme</h3>
            <div className="mx-auto max-w-sm" style={previewVars as React.CSSProperties}>
              <div className="h-10 rounded-2xl flex items-center justify-center text-xs font-medium"
                   style={{ background: hexToRgba(primary, .08), color: 'var(--ap-text)', fontFamily: 'var(--ap-font)' }}>
                {draft.brand.appName}
              </div>

              <div className="mt-4 rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(0,0,0,.08)' }}>
                <Image src={draft.home.bannerImage} alt="banner" width={800} height={400} className="w-full h-40 object-cover" />
              </div>

              <div className="mt-4 text-sm rounded-xl border p-3"
                   style={{ borderColor: 'var(--ap-primary)', background: hexToRgba(primary, .08), color: 'var(--ap-text)' }}>
                <div className="font-semibold mb-1" style={{ color: 'var(--ap-primary)' }}>Duyuru</div>
                <div>{draft.home.noticeText}</div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-xs" style={{ color: 'var(--ap-text)', fontFamily: 'var(--ap-font)' }}>
                {draft.navigation.tabs.map((t, i) => (
                  <div key={i} className="rounded-xl border px-2 py-3 text-center" style={{ borderColor: 'rgba(0,0,0,.08)' }}>
                    <div className="h-6 flex items-center justify-center mb-1">
                      {t.iconKind === 'emoji' && <span className="text-lg">{t.emoji ?? '✨'}</span>}
                      {t.iconKind === 'image' && t.iconImage?.startsWith('http') && (
                        <span className="inline-block h-5 w-5 relative">
                          <Image src={t.iconImage} alt="icon" fill sizes="20px" className="object-contain" unoptimized />
                        </span>
                      )}
                      {t.iconKind === 'builtin' && <span className="text-lg" style={{ color: 'var(--ap-secondary)' }}>✨</span>}
                    </div>
                    <div className="font-medium">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ===== Reusable UI ===== */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[390px]">
      <div className="relative mx-auto h-[844px] w-[390px] rounded-[48px] border border-slate-300 bg-slate-900/90 shadow-[0_10px_40px_rgba(0,0,0,.25)] overflow-hidden">
        {/* notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 w-36 rounded-b-2xl bg-black/80 z-20" />
        {/* inner bezels */}
        <div className="absolute inset-1 rounded-[40px] bg-white overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
function FrameFallback({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[32px] bg-slate-50 text-slate-500 p-6 text-center">
      {text}
    </div>
  );
}

function ColorPicker(props: { label: string; value: string; onChange: (val: string) => void }) {
  const { label, value, onChange } = props;
  const safe = typeof value === 'string' ? value : '#111827';
  return (
    <div>
      <label className="text-sm">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => {
            const active = safe.toLowerCase() === c.toLowerCase();
            return (
              <button key={c} type="button" onClick={() => onChange(c)}
                className={cn('h-8 w-8 rounded-md border border-slate-300', active && 'ring-2 ring-offset-2 ring-amber-500')}
                style={{ background: c }} title={c} />
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <input type="color" value={safe} onChange={(e)=> onChange(e.target.value)} className="h-9 w-9 rounded border border-slate-300 p-0" />
          <input value={safe} onChange={(e)=> onChange(e.target.value)} className="h-9 w-32 rounded-xl border border-slate-300 px-2 text-sm" />
        </div>
      </div>
    </div>
  );
}

function FontPicker(props: { label: string; value: FontFamily; onChange: (v: FontFamily) => void }) {
  const { label, value, onChange } = props;
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select value={value} onChange={(e)=> onChange(e.target.value as FontFamily)}
        className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3">
        {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      <p className="mt-1 text-xs text-slate-500">Not: Özel font yükleme bir sonraki sürümde.</p>
    </div>
  );
}
function SegButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={cn('h-9 px-3 rounded-lg border text-sm', active ? 'bg-amber-50 border-amber-500 text-amber-700' : 'border-slate-300 hover:bg-slate-50')}>
      {children}
    </button>
  );
}