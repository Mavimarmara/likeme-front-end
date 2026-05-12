import { getApiUrl } from '@/config';

export interface ShippingOption {
  codigo: string;
  nome: string;
  valor: number;
  prazoEntrega: string;
  valorMaoPropria: string;
  valorAvisoRecebimento: string;
  entregaDomiciliar: string;
  entregaSabado: string;
  msgErro?: string;
}

export interface ShippingQuoteResponse {
  options: ShippingOption[];
  minValue: number;
  /** Quando false, o backend determinou que os itens não geram frete (valor 0). */
  requiresShipping: boolean;
  cepDestino: string;
}

export interface ShippingPolicyResponse {
  requiresShipping: boolean;
}

const buildProductIdsQuery = (productIds?: ReadonlyArray<string>): string => {
  if (!productIds || productIds.length === 0) {
    return '';
  }
  return `&productIds=${encodeURIComponent(productIds.join(','))}`;
};

/**
 * Consulta opções de frete dos Correios para um CEP.
 * Quando `productIds` é fornecido, o backend é a fonte de verdade para determinar se o
 * frete se aplica ao conjunto (ex.: pedidos só com programs/services retornam minValue=0).
 */
export async function getShippingQuote(
  cep: string,
  productIds?: ReadonlyArray<string>,
): Promise<ShippingQuoteResponse> {
  const digits = (cep || '').replace(/\D/g, '');
  if (digits.length !== 8) {
    throw new Error('CEP inválido');
  }

  const url = getApiUrl(`/api/shipping/quote?cep=${encodeURIComponent(digits)}${buildProductIdsQuery(productIds)}`);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  } catch (networkError: any) {
    const msg = networkError?.message || '';
    if (/network|failed to fetch|internet|connection/i.test(msg)) {
      throw new Error('Verifique sua conexão e tente novamente.');
    }
    throw new Error('Não foi possível consultar o frete. Tente novamente.');
  }

  let data: any = {};
  try {
    const text = await response.text();
    if (text) {
      data = JSON.parse(text);
    }
  } catch {
    // Resposta não é JSON (ex.: página de erro HTML)
  }

  if (!response.ok) {
    const status = response.status;
    const apiMessage = data?.message || data?.error;
    let message: string;
    if (apiMessage && typeof apiMessage === 'string' && apiMessage.trim()) {
      message = apiMessage.trim();
    } else if (status === 404) {
      message = `Serviço de frete não disponível. (Erro ${status})`;
    } else if (status >= 500) {
      message = `Problema temporário no servidor. Tente novamente em alguns minutos. (Erro ${status})`;
    } else {
      message = `Não foi possível consultar o frete. (Erro ${status})`;
    }
    const error: Error & { status?: number } = new Error(message);
    error.status = status;
    throw error;
  }

  if (!data?.success || !data?.data) {
    throw new Error(data?.message || 'Resposta inválida do servidor');
  }

  return data.data as ShippingQuoteResponse;
}

/**
 * Consulta no backend se uma lista de produtos exige frete. O backend é fonte única da regra.
 * Em caso de falha, lança erro — o caller deve decidir o fallback (ex.: exigir frete).
 */
export async function getShippingPolicy(productIds: ReadonlyArray<string>): Promise<ShippingPolicyResponse> {
  const url = getApiUrl(`/api/shipping/policy?${buildProductIdsQuery(productIds).replace(/^&/, '')}`);

  let response: Response;
  try {
    response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
  } catch (networkError: any) {
    const msg = networkError?.message || '';
    if (/network|failed to fetch|internet|connection/i.test(msg)) {
      throw new Error('Verifique sua conexão e tente novamente.');
    }
    throw new Error('Não foi possível consultar a política de frete.');
  }

  let data: any = {};
  try {
    const text = await response.text();
    if (text) {
      data = JSON.parse(text);
    }
  } catch {
    // Resposta não é JSON
  }

  if (!response.ok || !data?.success || !data?.data) {
    const apiMessage = data?.message || data?.error || 'Falha ao consultar política de frete';
    const error: Error & { status?: number } = new Error(apiMessage);
    error.status = response.status;
    throw error;
  }

  return data.data as ShippingPolicyResponse;
}
