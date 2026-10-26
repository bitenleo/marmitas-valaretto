import { getStore } from '@netlify/blobs';

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
  'pragma': 'no-cache',
  'expires': '0'
};

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });

function cleanList(value, max) {
  return Array.isArray(value)
    ? value.map(String).map(v => v.trim()).filter(Boolean).slice(0, max)
    : [];
}

export default async (request) => {
  try {
    const store = getStore({ name: 'valaretto-menu', consistency: 'strong' });
    const url = new URL(request.url);
    const method = request.method || 'GET';

    if (method === 'GET' && url.searchParams.get('auth') === '1') {
      const expected = process.env.ADMIN_PASSWORD || '';
      const supplied = request.headers.get('x-admin-password') || '';
      if (!expected || supplied !== expected) return json({ ok: false, error: 'Não autorizado' }, 401);
      return json({ ok: true });
    }

    if (method === 'GET') {
      const menu = await store.get('current', { type: 'json', consistency: 'strong' });
      if (!menu) return json({ error: 'Menu ainda não salvo no editor.' }, 404);
      return json(menu);
    }

    if (method === 'POST') {
      const expected = process.env.ADMIN_PASSWORD || '';
      const supplied = request.headers.get('x-admin-password') || '';
      if (!expected || supplied !== expected) return json({ error: 'Não autorizado' }, 401);

      let payload;
      try {
        payload = await request.json();
      } catch {
        return json({ error: 'JSON inválido' }, 400);
      }

      const cleaned = {
        date: String(payload.date || '').trim().slice(0, 30),
        arrozOptions: cleanList(payload.arrozOptions, 6).length ? cleanList(payload.arrozOptions, 6) : ['Arroz Branco'],
        notice: String(payload.notice || '').trim().slice(0, 180),
        refogados: cleanList(payload.refogados, 20),
        massas: cleanList(payload.massas, 20),
        carnes: cleanList(payload.carnes, 5),
        updatedAt: new Date().toISOString()
      };

      await store.setJSON('current', cleaned);
      const confirmed = await store.get('current', { type: 'json', consistency: 'strong' });
      return json({ ok: true, menu: confirmed || cleaned });
    }

    return json({ error: 'Método não permitido' }, 405);
  } catch (error) {
    console.error('menu function error', error);
    return json({ error: 'Falha interna ao acessar o cardápio.' }, 500);
  }
};

export const config = { path: '/api/menu' };
