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
  cepDestino: string;
}

/**
 * Consulta opções de frete dos Correios para um CEP.
 * Retorna as opções (PAC, SEDEX) e o menor valor.
 */
export async function getShippingQuote(cep: string): Promise<ShippingQuoteResponse> {
  const digits = (cep || '').replace(/\D/g, '');
  if (digits.length !== 8) {
    throw new Error('CEP inválido');
  }

  const url = getApiUrl(`/api/shipping/quote?cep=${encodeURIComponent(digits)}`);

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
