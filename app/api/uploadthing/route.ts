// app/api/ingest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const KEYWORDS = {
  home:   ['anasayfa','ana sayfa','home','homepage'],
  cart:   ['sepet','sepetim','cart','basket','bag','shopping cart'],
  orders: ['siparişlerim','siparislerim','sipariş','siparis','orders','my orders','order history','sipariş takip','siparis takip'],
};

function absolutize(href: string, base: URL) {
  try { return new URL(href, base).toString(); } catch { return ''; }
}

function textOf($el: cheerio.Cheerio) {
  return (
    ($el.text() || '') + ' ' +
    ($el.attr('aria-label') || '') + ' ' +
    ($el.attr('title') || '')
  ).toLowerCase().trim();
}

function hrefOf($el: cheerio.Cheerio) {
  const direct = ($el.attr('href') || '').trim();
  if (direct) return direct;
  const onclick = $el.attr('onclick') || '';
  const m = onclick.match(/location\.href\s*=\s*['"]([^'"]+)['"]/i);
  return m?.[1] || '';
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

  let base: URL;
  try { base = new URL(url); } catch { return NextResponse.json({ error: 'Bad url' }, { status: 400 }); }

  try {
    const res = await fetch(base.toString(), {
      redirect: 'follow',
      headers: { 'User-Agent': 'ApploraBot/1.0' },
      // bazı siteler gzip/deflate istiyor; Next fetch bunu otomatik halleder
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const nodes = $('a, [role="link"], button').toArray().map(el => {
      const $el = $(el);
      const href = hrefOf($el);
      const abs = absolutize(href, base);
      const text = textOf($el);
      return { href, abs, text };
    });

    const findBy = (keys: string[], fallbackPaths: string[]) => {
      // 1) metin/label/title eşleşmesi
      for (const k of keys) {
        const hit = nodes.find(n => n.text.includes(k));
        if (hit?.abs) return hit.abs;
      }
      // 2) path/ipucu
      for (const p of fallbackPaths) {
        const hit = nodes.find(n => n.abs.toLowerCase().includes(p));
        if (hit?.abs) return hit.abs;
      }
      return '';
    };

    const home   = findBy(KEYWORDS.home,   ['/', '/home']);
    const cart   = findBy(KEYWORDS.cart,   ['/cart','/basket','/bag','/sepet','/sepetim']);
    const orders = findBy(KEYWORDS.orders, ['/orders','/order','/account/orders','/hesabim','/hesabım','/siparis','/sipariş']);

    return NextResponse.json({
      home:   home   || base.origin + '/',
      cart:   cart   || new URL('/cart', base).toString(),
      orders: orders || new URL('/account/orders', base).toString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'fetch-failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}