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
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || 'Erro ao consultar frete';
    const error: Error & { status?: number } = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (!data?.success || !data?.data) {
    throw new Error(data?.message || 'Resposta inválida');
  }

  return data.data as ShippingQuoteResponse;
}
