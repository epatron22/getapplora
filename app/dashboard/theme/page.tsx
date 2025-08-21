'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ThemeUploader from '../../components/ThemeUploader';

/* ================= Types ================= */
type IconName = 'home'|'shopping_bag'|'person'|'favorite'|'search'|'info';
type IconKind = 'builtin' | 'emoji' | 'image';
const FONT_OPTIONS = ['System','Inter','Roboto','Poppins'] as const;
type FontFamily = (typeof FONT_OPTIONS)[number];

type Tab = {
  label: string; url: string; iconKind: IconKind;
  builtin?: IconName; emoji?: string; iconImage?: string;
};

type ThemeDraft = {
  site: { url: string };
  shell: {
    appName: string;
    primary: string;
    secondary: string;
    textColor: string;
    fontFamily: FontFamily;
    tabs: Tab[];

    bannerEnabled: boolean;
    bannerImage?: string;
    bannerLink?: string;
    noticeText?: string;
    noticeBg?: string;
    noticeTextColor?: string;
  };
};

/* ================ Presets ================ */
const SAMPLE_BANNERS = [
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1200&auto=format&fit=crop',
] as const;

const COLOR_SWATCHES = ['#111827','#000000','#374151','#6B7280','#EA580C','#F59E0B','#0EA5E9','#22C55E','#8B5CF6','#EF4444','#FFFFFF'] as const;
const EMOJI_SET = ['🏠','🛍️','👤','❤️','🔎','ℹ️','⭐️','🔥','✨','🧁','🍫','🛒'] as const;

/* ================ Helpers ================ */
const isString = (v: unknown): v is string => typeof v === 'string';
const cn = (...p: Array<string | false | undefined>) => p.filter(Boolean).join(' ');
const hexToRgba = (hex: string, a = 1) => {
  const h = (hex || '').replace('#',''); if (h.length!==6) return `rgba(17,24,39,${a})`;
  const r = parseInt(h.slice(0,2),16); const g = parseInt(h.slice(2,4),16); const b = parseInt(h.slice(4,6),16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
const contrastOn = (hex: string) => {
  const h = (hex || '').replace('#',''); if (h.length!==6) return '#ffffff';
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  return (r*299 + g*587 + b*114)/1000 >= 186 ? '#111827' : '#ffffff';
};
const sanitizeHex = (c: unknown, fb = '#111827') => isString(c) && /^#[\da-fA-F]{6}$/.test(c.trim()) ? c.trim() : fb;
const normalizeUrl = (u: string) => { try { const url = new URL(u.startsWith('http')?u:`https://${u}`); return url.toString(); } catch { return ''; } };
const fontStackOf = (f: FontFamily) =>
  f==='Inter' ? 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial'
: f==='Roboto'? 'Roboto, ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial'
: f==='Poppins'? 'Poppins, ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial'
: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial';

/** localStorage → yeni şemaya migrate */
function migrateDraft(raw: unknown): ThemeDraft {
  const d = (raw ?? {}) as Record<string, unknown>;
  const site = (d.site as Record<string, unknown>) ?? {};
  const shell = (d.shell as Record<string, unknown>) ?? {};
  const tabsUnknown = Array.isArray(shell.tabs) ? (shell.tabs as unknown[]) : [];
  const fontCandidate = shell.fontFamily;

  const fontFamily: FontFamily =
    ['System','Inter','Roboto','Poppins'].includes(String(fontCandidate))
      ? (fontCandidate as FontFamily)
      : 'System';

  return {
    site: { url: isString(site.url) ? site.url : 'https://www.arslanzade.com.tr/' },
    shell: {
      appName: isString(shell.appName) ? shell.appName : 'Mağazam',
      primary: sanitizeHex(shell.primary, '#EA580C'),
      secondary: sanitizeHex(shell.secondary, '#F59E0B'),
      textColor: sanitizeHex(shell.textColor, '#111827'),
      fontFamily,
      tabs: tabsUnknown.map((t) => {
        const tr = (t ?? {}) as Record<string, unknown>;
        const kindRaw = tr.iconKind;
        const iconKind: IconKind =
          kindRaw==='image'||kindRaw==='emoji'||kindRaw==='builtin' ? (kindRaw as IconKind) : 'builtin';
        return {
          label: isString(tr.label) ? tr.label : 'Yeni',
          url: isString(tr.url) ? tr.url : '/',
          iconKind,
          builtin: (tr.builtin as IconName) ?? 'home',
          emoji: isString(tr.emoji) ? tr.emoji : '✨',
          iconImage: isString(tr.iconImage) ? tr.iconImage : '',
        };
      }),
      bannerEnabled: Boolean(shell.bannerEnabled ?? false),
      bannerImage: isString(shell.bannerImage) ? shell.bannerImage : SAMPLE_BANNERS[0],
      bannerLink: isString(shell.bannerLink) ? shell.bannerLink : '/',
      noticeText: isString(shell.noticeText) ? shell.noticeText : 'Bugün %15 indirim!',
      noticeBg: sanitizeHex(shell.noticeBg, '#FFF7ED'),
      noticeTextColor: sanitizeHex(shell.noticeTextColor, '#7C2D12'),
    },
  };
}

/* ================ Initial ================ */
const initialDraft: ThemeDraft = {
  site: { url: 'https://www.arslanzade.com.tr/' },
  shell: {
    appName: 'Mağazam',
    primary: '#EA580C',
    secondary: '#F59E0B',
    textColor: '#111827',
    fontFamily: 'System',
    tabs: [
      { label:'Home', url:'/', iconKind:'builtin', builtin:'home' },
      { label:'Shop', url:'/kategori', iconKind:'builtin', builtin:'shopping_bag' },
      { label:'Hesap', url:'/account', iconKind:'builtin', builtin:'person' },
    ],
    bannerEnabled: false,
    bannerImage: SAMPLE_BANNERS[0],
    bannerLink: '/',
    noticeText: 'Bugün %15 indirim!',
    noticeBg: '#FFF7ED',
    noticeTextColor: '#7C2D12',
  },
};

/* ================ Page ================== */
export default function ThemeEditor() {
  const [draft, setDraft] = useState<ThemeDraft>(initialDraft);
  const [webUrl, setWebUrl] = useState<string>(initialDraft.site.url);
  const [frameKey, setFrameKey] = useState<number>(0);
  const [frameBlocked, setFrameBlocked] = useState<boolean>(false);
  const [ingesting, setIngesting] = useState<boolean>(false);
  const loadTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme_draft');
      if (saved) {
        const md = migrateDraft(JSON.parse(saved));
        setDraft(md);
        setWebUrl(md.site.url);
      }
    } catch {}
    return () => { if (loadTimer.current) clearTimeout(loadTimer.current); };
  }, []);

  const setShell = <K extends keyof ThemeDraft['shell']>(k: K, v: ThemeDraft['shell'][K]) =>
    setDraft(d => ({ ...d, shell: { ...d.shell, [k]: v } }));
  const setTab = <K extends keyof Tab>(i: number, k: K, v: Tab[K]) =>
    setDraft(d => { const tabs = [...d.shell.tabs]; tabs[i] = { ...tabs[i], [k]: v }; return { ...d, shell: { ...d.shell, tabs } }; });
  const addTab = () => setDraft(d => ({ ...d, shell: { ...d.shell, tabs: [...d.shell.tabs, { label:'Yeni', url:'/', iconKind:'emoji', emoji:'✨' }] } }));
  const removeTab = (i: number) => setDraft(d => ({ ...d, shell: { ...d.shell, tabs: d.shell.tabs.filter((_, idx)=> idx!==i) } }));

  const saveDraft = () => { localStorage.setItem('theme_draft', JSON.stringify({ ...draft, site:{ url: webUrl } })); alert('Taslak kaydedildi.'); };
  const publishDraft = () => { localStorage.setItem('theme_published', JSON.stringify({ ...draft, site:{ url: webUrl } })); alert('Yayınlandı (demo).'); };
  const resetAll = () => {
    localStorage.removeItem('theme_draft'); localStorage.removeItem('theme_published');
    setDraft(initialDraft); setWebUrl(initialDraft.site.url); setFrameKey(k=>k+1); setFrameBlocked(false);
  };

  // Tema sadece telefon önizlemeye uygulanır
  const { shell } = draft;
  const previewVars = {
    '--ap-primary': shell.primary,
    '--ap-secondary': shell.secondary,
    '--ap-text': shell.textColor,
    '--ap-on-primary': contrastOn(shell.primary),
    '--ap-font': fontStackOf(shell.fontFamily),
    '--ap-notice-bg': shell.noticeBg,
    '--ap-notice-text': shell.noticeTextColor,
  } as React.CSSProperties;

  // iPhone 14 Pro safe areas
  const SAFE_TOP = 34;      // notch yüksekliği
  const SAFE_BOTTOM = 88;   // alt menü + padding

  const onFrameLoad = () => { if (loadTimer.current) clearTimeout(loadTimer.current); setFrameBlocked(false); };
  const tryLoad = () => {
    setFrameBlocked(false);
    setFrameKey(k => k + 1);
    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setFrameBlocked(true), 2500);
  };

  // Siteden menü & sepet & sipariş linklerini çek
  const importMenuFromSite = async () => {
    const base = normalizeUrl(webUrl);
    if (!base) { alert('Geçerli bir site adresi gir.'); return; }
    try {
      setIngesting(true);
      const res = await fetch(`/api/ingest?url=${encodeURIComponent(base)}`, { method: 'GET' });
      if (!res.ok) throw new Error('İndeksleme başarısız');
      const data: { home?: string; cart?: string; orders?: string } = await res.json();

      const home = data.home || base;
      const cart = data.cart || new URL('/cart', base).toString();
      const orders = data.orders || new URL('/account/orders', base).toString();

      const tabs: Tab[] = [
        { label:'Anasayfa', url: home, iconKind:'builtin', builtin:'home' },
        { label:'Sepet', url: cart, iconKind:'builtin', builtin:'shopping_bag' },
        { label:'Siparişlerim', url: orders, iconKind:'builtin', builtin:'info' },
      ];
      setDraft(d => ({ ...d, shell: { ...d.shell, tabs } }));
      alert('Menü bağlantıları çekildi.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Hata';
      alert(`Alınamadı: ${msg}`);
    } finally {
      setIngesting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl" style={{ background: `linear-gradient(135deg, ${shell.primary}, ${shell.secondary})` }} />
            <div className="font-semibold">Tema Editörü</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={saveDraft} className="h-9 rounded-xl border px-4 text-sm font-semibold hover:bg-slate-50 border-slate-300">Taslağı Kaydet</button>
            <button onClick={publishDraft} className="h-9 rounded-xl px-4 text-sm font-semibold" style={{ background: shell.primary, color: contrastOn(shell.primary) }}>Yayınla</button>
            <button onClick={resetAll} className="h-9 rounded-xl border px-3 text-sm font-semibold hover:bg-red-50 border-slate-300 text-red-700">Sıfırla</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-8">
        {/* LEFT — Editör */}
        <div className="space-y-8">
          {/* Webview URL */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Webview</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto_auto] items-end">
              <div>
                <label className="text-sm">Site adresi</label>
                <input value={webUrl} onChange={(e)=> setWebUrl(e.target.value)} className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3" placeholder="https://magazan.com" />
              </div>
              <button onClick={tryLoad} className="h-11 rounded-xl border border-slate-300 px-4 hover:bg-slate-50">Yenile</button>
              <a href={normalizeUrl(webUrl) || '#'} target="_blank" className="h-11 rounded-xl border border-slate-300 px-4 hover:bg-slate-50 flex items-center justify-center">Yeni sekmede aç</a>
              <button disabled={ingesting} onClick={importMenuFromSite} className="h-11 rounded-xl border border-slate-300 px-4 hover:bg-slate-50 disabled:opacity-50">
                {ingesting ? 'Çekiliyor…' : 'Menüyü Siteden Çek'}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">Bazı siteler iframe’i engeller (X‑Frame‑Options/CSP). Engellenirse telefonda uyarı gösterilir.</p>
          </section>

          {/* Tema (Shell) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Tema (Uygulama Kabuğu)</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm">Uygulama Adı</label>
                <input value={shell.appName} onChange={(e)=> setShell('appName', e.target.value)} className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3" placeholder="Mağaza adı" />
              </div>
              <ColorPicker label="Ana Renk (Primary)" value={shell.primary} onChange={(v)=> setShell('primary', v)} />
              <ColorPicker label="İkincil Renk (Secondary)" value={shell.secondary} onChange={(v)=> setShell('secondary', v)} />
              <ColorPicker label="Metin Rengi" value={shell.textColor} onChange={(v)=> setShell('textColor', v)} />
              <FontPicker label="Yazı Tipi" value={shell.fontFamily} onChange={(v)=> setShell('fontFamily', v)} />
            </div>
          </section>

          {/* Duyuru (Seçmeli) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Duyuru Alanı</h2>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={shell.bannerEnabled} onChange={(e)=> setShell('bannerEnabled', e.target.checked)} />
                <span>Aktif</span>
              </label>
            </div>

            {shell.bannerEnabled && (
              <div className="mt-4 grid gap-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm">Duyuru Metni</label>
                    <input value={shell.noticeText ?? ''} onChange={(e)=> setShell('noticeText', e.target.value)}
                      className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3" placeholder="Örn. Bugün %15 indirim!" />
                  </div>
                  <div>
                    <label className="text-sm">Banner Linki</label>
                    <input value={shell.bannerLink ?? ''} onChange={(e)=> setShell('bannerLink', e.target.value)}
                      className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3" placeholder="https://..." />
                  </div>
                </div>

                <div>
                  <label className="text-sm">Banner Görseli (URL)</label>
                  <input value={shell.bannerImage ?? ''} onChange={(e)=> setShell('bannerImage', e.target.value)}
                    className="mt-1 w-full h-11 rounded-xl border border-slate-300 px-3" placeholder="https://..." />
                  <div className="mt-2">
                    <ThemeUploader text="Banner Yükle" onUploaded={(url)=> setShell('bannerImage', url)} />
                    <p className="mt-1 text-xs text-slate-500">JPG/PNG, max 4MB.</p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {SAMPLE_BANNERS.map((src)=>(
                      <button key={src} type="button" onClick={()=> setShell('bannerImage', src)}
                        className={cn('relative h-16 w-28 overflow-hidden rounded-xl border border-slate-300',
                          (shell.bannerImage ?? '') === src && 'ring-2 ring-offset-2 ring-amber-500')}>
                        <Image src={src} alt="sample" fill sizes="112px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <ColorPicker label="Duyuru Arka Plan" value={shell.noticeBg ?? '#FFF7ED'} onChange={(v)=> setShell('noticeBg', v)} />
                  <ColorPicker label="Duyuru Yazı Rengi" value={shell.noticeTextColor ?? '#7C2D12'} onChange={(v)=> setShell('noticeTextColor', v)} />
                </div>
              </div>
            )}
          </section>

          {/* Alt Menü */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Alt Menü</h2>
              <button onClick={addTab} className="h-9 rounded-lg border border-slate-300 px-3 text-sm hover:bg-slate-50">Sekme Ekle</button>
            </div>

            <div className="mt-4 space-y-6">
              {shell.tabs.map((t, i) => (
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
        </div>

        {/* RIGHT — Telefon önizleme */}
        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Uygulama Önizleme</h3>

            <div className="mx-auto w-[390px]">
              <div className="relative mx-auto h-[844px] w-[390px] rounded-[48px] border border-slate-300 bg-slate-900/90 shadow-[0_10px_40px_rgba(0,0,0,.25)] overflow-hidden"
                   style={previewVars as React.CSSProperties}>
                {/* notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 w-36 rounded-b-2xl bg-black/80 z-30" />

                {/* inner screen */}
                <div className="absolute inset-1 rounded-[40px] overflow-hidden bg-white">
                  {/* WebView (iframe) — safe areas */}
                  {normalizeUrl(webUrl) ? (
                    <iframe
                      key={frameKey}
                      src={normalizeUrl(webUrl)}
                      className="absolute left-0 right-0"
                      style={{ top: SAFE_TOP, bottom: SAFE_BOTTOM }}
                      sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                      onLoad={onFrameLoad}
                    />
                  ) : (
                    <div className="absolute left-0 right-0" style={{ top: SAFE_TOP, bottom: SAFE_BOTTOM }}>
                      <FrameFallback text="Geçerli bir URL girin" />
                    </div>
                  )}
                  {frameBlocked && (
                    <div className="absolute left-0 right-0" style={{ top: SAFE_TOP, bottom: SAFE_BOTTOM }}>
                      <FrameFallback text="Site iframe’e izin vermiyor (X‑Frame‑Options/CSP)" />
                    </div>
                  )}

                  {/* Duyuru (opsiyonel) — safe top + 8px */}
                  {shell.bannerEnabled && (
                    <a
                      href={shell.bannerLink || '#'}
                      target="_blank"
                      className="absolute left-3 right-3 z-40 rounded-xl border px-3 py-2 text-xs font-medium"
                      style={{
                        top: SAFE_TOP + 8,
                        background: shell.noticeBg,
                        color: shell.noticeTextColor,
                        borderColor: hexToRgba('#000', .15),
                        fontFamily: 'var(--ap-font)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {shell.bannerImage && (
                          <span className="relative inline-block h-6 w-10 overflow-hidden rounded">
                            <Image src={shell.bannerImage} alt="banner" fill sizes="40px" className="object-cover" />
                          </span>
                        )}
                        <span>{shell.noticeText}</span>
                      </div>
                    </a>
                  )}

                  {/* Alt menü (zorunlu) */}
                  <div className="absolute inset-x-3 bottom-3 z-40 rounded-2xl border bg-white/95 backdrop-blur px-2 py-2"
                       style={{ borderColor: hexToRgba('#000', .12), fontFamily: 'var(--ap-font)', color:'var(--ap-text)' }}>
                    <div className="grid grid-cols-3 gap-2">
                      {shell.tabs.map((t, i) => (
                        <a key={i} href={t.url} target="_blank"
                           className="rounded-xl border px-2 py-2 text-center text-[11px] hover:bg-slate-50"
                           style={{ borderColor: hexToRgba('#000', .08) }}>
                          <div className="h-5 mb-1 flex items-center justify-center">
                            {t.iconKind === 'emoji' && <span className="text-lg">{t.emoji ?? '✨'}</span>}
                            {t.iconKind === 'image' && t.iconImage?.startsWith('http') && (
                              <span className="inline-block h-4 w-4 relative">
                                <Image src={t.iconImage} alt="icon" fill sizes="16px" className="object-contain" unoptimized />
                              </span>
                            )}
                            {t.iconKind === 'builtin' && <span className="text-lg" style={{ color: 'var(--ap-secondary)' }}>✨</span>}
                          </div>
                          <div className="font-medium">{t.label}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">Boyut: 390×844 (iPhone 14 Pro). Tema yalnızca bu önizlemeye uygulanır.</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ================= Subcomponents ================= */
function FrameFallback({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-500 p-6 text-center">
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
      <p className="mt-1 text-xs text-slate-500">Özel font yükleme sonraki sürümde.</p>
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