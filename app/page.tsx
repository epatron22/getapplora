import React from 'react';

// This file can be used as Next.js app/page.tsx or a standalone React page.
// TailwindCSS assumed. Replace links and brand as needed.

export default function Landing() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500"></div>
            <span className="font-semibold tracking-tight">Applora</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-amber-600">Özellikler</a>
            <a href="#how" className="hover:text-amber-600">Nasıl Çalışır</a>
            <a href="#pricing" className="hover:text-amber-600">Fiyatlar</a>
            <a href="#faq" className="hover:text-amber-600">SSS</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#demo" className="hidden sm:inline-flex h-10 items-center rounded-xl border border-slate-300 px-4 text-sm font-medium hover:bg-slate-50">Canlı Demo</a>
            <a href="#get-started" className="inline-flex h-10 items-center rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white hover:bg-amber-700">Hemen Başla</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_80%_at_50%_0%,rgba(251,191,36,0.15),transparent_60%),radial-gradient(60%_60%_at_90%_10%,rgba(244,63,94,0.12),transparent_50%)]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              E‑ticaret siteni <span className="text-amber-600">1 günde</span> mobil uygulamaya çevir.
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Applora ile mağazanı iOS ve Android uygulamasına dönüştür: WebView + push bildirim + tema düzenleyici + otomatik mağaza yükleme.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#get-started" className="inline-flex h-11 items-center rounded-xl bg-amber-600 px-5 text-sm font-semibold text-white hover:bg-amber-700">Ücretsiz Başla</a>
              <a href="#pricing" className="inline-flex h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold hover:bg-slate-50">Fiyatları Gör</a>
            </div>
            <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
              <span>⚡ 24 saatte ilk sürüm</span>
              <span>•</span>
              <span>✅ App Store & Google Play uyumlu</span>
              <span>•</span>
              <span>🔔 Push bildirim</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[9/16] w-full max-w-sm mx-auto rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
              <div className="h-10 bg-slate-100 flex items-center justify-center text-xs">App Önizleme</div>
              <div className="p-4 grid gap-4">
                <div className="h-28 rounded-2xl bg-gradient-to-br from-amber-200 to-rose-200" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-24 rounded-xl bg-slate-100" />
                  <div className="h-24 rounded-xl bg-slate-100" />
                </div>
                <div className="h-10 rounded-xl bg-slate-100" />
                <div className="h-28 rounded-2xl bg-slate-100" />
              </div>
              <div className="sticky bottom-0 border-t border-slate-200 bg-white p-3 flex items-center justify-around text-xs">
                <div className="flex flex-col items-center gap-1"><span>🏠</span><span>Ana Sayfa</span></div>
                <div className="flex flex-col items-center gap-1"><span>🛍️</span><span>Mağaza</span></div>
                <div className="flex flex-col items-center gap-1"><span>👤</span><span>Hesap</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-8 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
          <span>Shopify</span>
          <span>WooCommerce</span>
          <span>ikas</span>
          <span>IdeaSoft</span>
          <span>Ticimax</span>
          <span>Trendyol</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Özellikler</h2>
            <p className="mt-3 text-slate-600">Hızlı yayın, push bildirim, tema editörü ve çoklu platform desteği.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'WebView + Native Dokunuş',
                desc: 'Alt menü, dosya yükleme, çağrı/WhatsApp linkleri ile mağaza kabul oranı yüksek.'
              },
              {
                title: 'Push Bildirim',
                desc: 'Kampanya ve hatırlatmaları tek tıkla gönder.'
              },
              {
                title: 'Tema Editörü',
                desc: 'Renk, logo, alt menü ve ana sayfa bloklarını panelden yönet.'
              },
              {
                title: 'Otomatik Build',
                desc: 'Android AAB ve iOS TestFlight yüklemeleri otomatikleşsin.'
              },
              {
                title: 'Analitik',
                desc: 'Temel olaylar ve dönüşümleri ölç.'
              },
              {
                title: 'Destek',
                desc: 'Kurulum, ret düzeltme ve bakım hizmeti.'
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200 p-6 bg-white">
                <div className="text-2xl">✨</div>
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Nasıl Çalışır?</h2>
            <p className="mt-3 text-slate-600">3 adımda uygulaman hazır.</p>
          </div>
          <ol className="mt-8 grid md:grid-cols-3 gap-6">
            {[
              {n: '1', t: 'Formu doldur', d: 'Mağaza URL’i, logo ve renkleri gir.'},
              {n: '2', t: 'Önizle ve yayınla', d: 'Tema ayarlarını düzenle, bir tıkla build al.'},
              {n: '3', t: 'Mağazalarda yerini al', d: 'Google Play ve TestFlight yayın akışı.'}
            ].map((s) => (
              <li key={s.n} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="h-8 w-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">{s.n}</div>
                <h3 className="mt-3 font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Fiyatlar</h2>
            <p className="mt-3 text-slate-600">Şeffaf ve büyümeye uygun paketler.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[{
              name: 'Starter', price: '₺750/ay', items: ['Android (WebView)', 'Push bildirim', 'Alt menü + ikon', 'Temel analitik']
            }, {
              name: 'Pro', price: '₺1.750/ay', items: ['Android + iOS (TestFlight)', 'Tema editörü', 'Otomatik build', 'Öncelikli destek']
            }, {
              name: 'Premium', price: '₺2.750/ay', items: ['Tam paket', 'App Store yönlendirme desteği', 'Gelişmiş analitik', 'SLA (99.9%)']
            }].map((p, i) => (
              <div key={p.name} className={`rounded-2xl border p-6 ${i===1 ? 'border-amber-600 shadow-lg' : 'border-slate-200'} bg-white`}>
                <div className="text-xs uppercase tracking-wider text-slate-500">{p.name}</div>
                <div className="mt-2 text-3xl font-bold">{p.price}</div>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {p.items.map(it => <li key={it} className="flex gap-2"><span>✔️</span><span>{it}</span></li>)}
                </ul>
                <a href="#get-started" className={`mt-6 inline-flex h-11 items-center rounded-xl px-5 text-sm font-semibold ${i===1? 'bg-amber-600 text-white hover:bg-amber-700':'border border-slate-300 hover:bg-slate-50'}`}>Seç</a>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">*Fiyatlar örnektir. KDV hariçtir. Kurulum ücreti ayrıca alınır.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center">Sık Sorulan Sorular</h2>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {[
              {q: 'Sadece WebView mağazada kabul edilir mi?', a: 'Küçük native dokunuşlar (alt menü, push, dosya yükleme) ile kabul oranı artar. Varsayılan olarak bunları ekliyoruz.'},
              {q: 'Tema editörü var mı?', a: 'Evet. Renk, logo, alt menü ve ana sayfa blokları MVP’de mevcut; sonraki sürümlerde sürükle-bırak geliyor.'},
              {q: 'Ödemeler nasıl?', a: 'Aylık abonelik + tek seferlik kurulum. İyzico/PayTR ile tahsilat yapılır.'},
              {q: 'Kendi geliştirici hesabımdan yayınlar mısınız?', a: 'Evet, isterseniz kendi Play/App Store hesabınızdan yayınlıyoruz.'}
            ].map((f) => (
              <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="font-semibold">{f.q}</div>
                <div className="mt-2 text-sm text-slate-600">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">Hazır mısın?</h2>
          <p className="mt-3 text-slate-600">Formu doldur, 24 saat içinde ilk sürümünü hazır edelim.</p>
          <div className="mt-6 flex justify-center">
            <a href="#" className="inline-flex h-11 items-center rounded-xl bg-amber-600 px-6 text-sm font-semibold text-white hover:bg-amber-700">Demo İste</a>
          </div>
          <p className="mt-3 text-xs text-slate-500">Veya bize yaz: hello@getapplora.com</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 text-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500"></div>
            <span className="font-semibold">Applora</span>
            <span className="text-slate-400">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <a href="#">Gizlilik</a>
            <a href="#">Şartlar</a>
            <a href="#">İletişim</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
