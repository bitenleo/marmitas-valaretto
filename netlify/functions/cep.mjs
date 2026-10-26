const HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
  'pragma': 'no-cache',
  'expires': '0'
};

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: HEADERS });

async function fetchJson(url, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'accept': 'application/json', 'user-agent': 'Marmitas-Valaretto/1.0' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export default async (request) => {
  try {
    const url = new URL(request.url);
    const cep = String(url.searchParams.get('cep') || '').replace(/\D/g, '').slice(0, 8);

    if (cep.length !== 8) {
      return json({ ok: false, error: 'CEP inválido.' }, 400);
    }

    // 1) ViaCEP
    try {
      const data = await fetchJson(`https://viacep.com.br/ws/${cep}/json/`);
      if (!data?.erro && data?.logradouro) {
        return json({
          ok: true,
          cep,
          street: String(data.logradouro || '').trim(),
          neighborhood: String(data.bairro || '').trim(),
          city: String(data.localidade || '').trim(),
          state: String(data.uf || '').trim(),
          source: 'viacep'
        });
      }
      if (data?.erro) return json({ ok: false, error: 'CEP não encontrado.' }, 404);
    } catch (err) {
      console.warn('ViaCEP falhou:', err?.message || err);
    }

    // 2) Fallback BrasilAPI
    try {
      const data = await fetchJson(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      const street = String(data?.street || '').trim();
      if (street) {
        return json({
          ok: true,
          cep,
          street,
          neighborhood: String(data?.neighborhood || '').trim(),
          city: String(data?.city || '').trim(),
          state: String(data?.state || '').trim(),
          source: 'brasilapi'
        });
      }
    } catch (err) {
      console.warn('BrasilAPI falhou:', err?.message || err);
    }

    return json({ ok: false, error: 'CEP não encontrado ou sem rua cadastrada.' }, 404);
  } catch (error) {
    console.error('cep function error', error);
    return json({ ok: false, error: 'Não foi possível consultar o CEP agora.' }, 500);
  }
};

export const config = { path: '/api/cep' };
