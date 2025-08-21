'use client';
import { useState } from 'react';

type Tab = { label: string; icon: string; url: string };
type ThemeDraft = {
  brand: {
    appName: string;
    primary: string;
    secondary: string;
    darkMode: boolean;
  };
  navigation: { tabs: Tab[] };
  home: {
    bannerImage: string;
    bannerLink: string;
    noticeText: string;
  };
};

const initialDraft: ThemeDraft = {
  brand: {
    appName: 'Mağazam',
    primary: '#EA580C',
    secondary: '#F59E0B',
    darkMode: false,
  },
  navigation: {
    tabs: [
      { label: 'Home', icon: 'home', url: 'https://ornek.com/' },
      { label: 'Shop', icon: 'shopping_bag', url: 'https://ornek.com/kategori' },
      { label: 'Hesap', icon: 'person', url: 'https://ornek.com/account' },
    ],
  },
  home: {
    bannerImage: 'https://picsum.photos/800/400',
    bannerLink: 'https://ornek.com',
    noticeText: 'Bugün %15 indirim!',
  },
};

export default function ThemeEditor() {
  const [draft, setDraft] = useState<ThemeDraft>(initialDraft);

  const updateBrand = (k: keyof ThemeDraft['brand'], v: any) =>
    setDraft(d => ({ ...d, brand: { ...d.brand, [k]: v } }));

  const updateHome = (k: keyof ThemeDraft['home'], v: any) =>
    setDraft(d => ({ ...d, home: { ...d.home, [k]: v } }));

  const updateTab = (i: number, k: keyof Tab, v: any) =>
    setDraft(d => {
      const tabs = [...d.navigation.tabs];
      tabs[i] = { ...tabs[i], [k]: v };
      return { ...d, navigation: { tabs } };
    });

  const addTab = () =>
    setDraft(d => ({
      ...d,
      navigation: { tabs: [...d.navigation.tabs, { label: 'Yeni', icon: 'info', url: 'https://ornek.com' }] },
    }));

  const removeTab = (i: number) =>
    setDraft(d => ({ ...d, navigation: { tabs: d.navigation.tabs.filter((_, idx) => idx !== i) } }));

  const onSaveDraft = () => {
    localStorage.setItem('theme_draft', JSON.stringify(draft));
    alert('Taslak kaydedildi (localStorage). Sonra backend bağlarız.');
  };

  const onPublish = () => {
    // Şimdilik publish de localStorage’a yazıyor.
    localStorage.setItem('theme_published', JSON.stringify(draft));
    alert('Yayınlandı (demo). Uygulama açılışta published.json’ı çekecek kurguyu sonra bağlarız.');
  };

  const bg = draft.brand.darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800';

  return (
    <main className="min-h-screen grid lg:grid-cols-2 gap-8 p-6">
      {/* Sol: Form */}
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Tema Editörü</h1>
          <p className="text-slate-600">Marka, menü ve ana sayfa ayarlarını düzenle.</p>
        </div>

        {/* BRAND */}
        <section className="rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold">Marka</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">Uygulama Adı</label>
              <input value={draft.brand.appName} onChange={e => updateBrand('appName', e.target.value)}
                className="mt-1 w-full h-10 rounded-xl border px-3" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Primary Renk (hex)</label>
              <input value={draft.brand.primary} onChange={e => updateBrand('primary', e.target.value)}
                className="mt-1 w-full h-10 rounded-xl border px-3" placeholder="#EA580C" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Secondary Renk (hex)</label>
              <input value={draft.brand.secondary} onChange={e => updateBrand('secondary', e.target.value)}
                className="mt-1 w-full h-10 rounded-xl border px-3" placeholder="#F59E0B" />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={draft.brand.darkMode} onChange={e => updateBrand('darkMode', e.target.checked)} />
                Koyu Tema
              </label>
            </div>
          </div>
        </section>

        {/* NAVIGATION */}
        <section className="rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Alt Menü</h2>
            <button onClick={addTab} className="text-sm rounded-lg border px-3 py-1 hover:bg-slate-50">Sekme Ekle</button>
          </div>
          <div className="mt-4 space-y-4">
            {draft.navigation.tabs.map((t, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 items-end">
                <div>
                  <label className="text-sm text-slate-600">Etiket</label>
                  <input value={t.label} onChange={e => updateTab(i, 'label', e.target.value)}
                    className="mt-1 w-full h-10 rounded-xl border px-3" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">İkon</label>
                  <select value={t.icon} onChange={e => updateTab(i, 'icon', e.target.value)}
                    className="mt-1 w-full h-10 rounded-xl border px-3">
                    <option value="home">home</option>
                    <option value="shopping_bag">shopping_bag</option>
                    <option value="person">person</option>
                    <option value="favorite">favorite</option>
                    <option value="search">search</option>
                    <option value="info">info</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input value={t.url} onChange={e => updateTab(i, 'url', e.target.value)}
                    className="mt-1 w-full h-10 rounded-xl border px-3" placeholder="https://..." />
                  <button onClick={() => removeTab(i)} className="h-10 px-3 rounded-lg border hover:bg-slate-50">Sil</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOME */}
        <section className="rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold">Ana Sayfa</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-sm text-slate-600">Banner Görseli URL</label>
              <input value={draft.home.bannerImage} onChange={e => updateHome('bannerImage', e.target.value)}
                className="mt-1 w-full h-10 rounded-xl border px-3" placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm text-slate-600">Banner Linki</label>
              <input value={draft.home.bannerLink} onChange={e => updateHome('bannerLink', e.target.value)}
                className="mt-1 w-full h-10 rounded-xl border px-3" placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm text-slate-600">Duyuru Metni</label>
              <input value={draft.home.noticeText} onChange={e => updateHome('noticeText', e.target.value)}
                className="mt-1 w-full h-10 rounded-xl border px-3" placeholder="Bugün %15 indirim!" />
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <button onClick={onSaveDraft} className="h-11 rounded-xl border border-slate-300 px-5 font-semibold hover:bg-slate-50">
            Taslağı Kaydet
          </button>
          <button onClick={onPublish} className="h-11 rounded-xl bg-amber-600 px-5 font-semibold text-white hover:bg-amber-700">
            Yayınla (Demo)
          </button>
        </div>
      </div>

      {/* Sağ: Canlı Önizleme (Mock) */}
      <div className={`rounded-3xl border border-slate-200 p-4 ${bg}`}>
        <div className="mx-auto max-w-sm">
          <div className="h-10 rounded-2xl bg-slate-100/50 flex items-center justify-center text-xs">
            {draft.brand.appName} · Önizleme
          </div>

          <div className="mt-4 rounded-2xl overflow-hidden">
            <img src={draft.home.bannerImage} alt="banner" className="w-full h-40 object-cover" />
          </div>

          <div className="mt-4 text-sm border rounded-xl p-3">
            <div><b>Duyuru:</b> {draft.home.noticeText}</div>
            <div className="text-xs text-slate-500">Renk: {draft.brand.primary} · Mod: {draft.brand.darkMode ? 'Koyu' : 'Açık'}</div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            {draft.navigation.tabs.map((t, i) => (
              <div key={i} className="rounded-xl border px-2 py-3 text-center">
                <div className="text-lg">✨</div>
                <div>{t.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <a href={draft.home.bannerLink} target="_blank" className="underline text-sm">
              Banner linkini aç
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}