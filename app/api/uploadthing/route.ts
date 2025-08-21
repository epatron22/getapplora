// app/api/ingest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const KEYWORDS = {
  home: ['anasayfa','home','homepage'],
  cart: ['sepet','cart','basket','bag'],
  orders: ['siparişlerim','siparislerim','orders','my orders','order history'],
};

function absolutize(href: string, base: URL) {
  try { return new URL(href, base).toString(); } catch { return ''; }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

  let base: URL;
  try { base = new URL(url); } catch { return NextResponse.json({ error: 'Bad url' }, { status: 400 }); }

  try {
    const res = await fetch(base.toString(), { redirect: 'follow', headers: { 'User-Agent': 'ApploraBot/1.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);

    const candidates = $('a[href]').map((_, el) => {
      const href = String($(el).attr('href') || '').trim();
      const text = $(el).text().trim().toLowerCase();
      return { href, text, abs: absolutize(href, base) };
    }).get();

    const findBy = (keys: string[], fallbackPaths: string[]) => {
      // 1) metne göre
      for (const k of keys) {
        const hit = candidates.find(c => c.text.includes(k));
        if (hit?.abs) return hit.abs;
      }
      // 2) href path'e göre
      for (const p of fallbackPaths) {
        const hit = candidates.find(c => c.abs.toLowerCase().includes(p));
        if (hit?.abs) return hit.abs;
      }
      return '';
    };

    const home   = findBy(KEYWORDS.home,   ['/', '/home']);
    const cart   = findBy(KEYWORDS.cart,   ['/cart','/basket','/sepet','/bag']);
    const orders = findBy(KEYWORDS.orders, ['/orders','/order','/account/orders','/hesabim/siparisler','/siparis']);

    return NextResponse.json({
      home: home || base.origin + '/',
      cart: cart || new URL('/cart', base).toString(),
      orders: orders || new URL('/account/orders', base).toString(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'fetch-failed' }, { status: 500 });
  }
}