'use client';

export default function Dashboard() {
  const buildAndroid = () => {
    alert('(Demo) Build kuyruğa alındı!');
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-bold">Proje Paneli</h1>
      <p className="mt-2 text-slate-600">Plan: Starter · Durum: Hazır</p>

      <div className="mt-6 grid gap-4 max-w-xl">
        <a
          href="/dashboard/theme"
          className="inline-flex items-center justify-center h-11 rounded-xl bg-amber-600 px-5 font-semibold text-white hover:bg-amber-700"
        >
          Temayı Düzenle
        </a>

        <button
          className="h-11 rounded-xl border border-slate-300 px-5 font-semibold hover:bg-slate-50 text-left"
          onClick={buildAndroid}
          type="button"
        >
          Build Al (Android)
        </button>
      </div>
    </main>
  );
}