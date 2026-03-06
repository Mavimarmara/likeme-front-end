/**
 * Resposta da API ViaCEP (https://viacep.com.br).
 * Quando o CEP é inválido, a API retorna { erro: true }.
 */
export interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: true;
}

const VIA_CEP_BASE = 'https://viacep.com.br/ws';

/**
 * Remove caracteres não numéricos do CEP.
 */
function normalizeZipCode(zipCode: string): string {
  return zipCode.replace(/\D/g, '');
}

/**
 * Valida formato do CEP (8 dígitos).
 */
export function isValidZipCodeFormat(zipCode: string): boolean {
  const digits = normalizeZipCode(zipCode);
  return digits.length === 8 && /^\d{8}$/.test(digits);
}

/**
 * Consulta um CEP na API ViaCEP.
 * @returns Dados do endereço se o CEP for válido; null se inválido ou erro de rede.
 */
export async function fetchAddressByZipCode(zipCode: string): Promise<ViaCepResponse | null> {
  const digits = normalizeZipCode(zipCode);
  if (digits.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(`${VIA_CEP_BASE}/${digits}/json/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return null;
    }

    const data: ViaCepResponse = await response.json();

    if (data.erro === true) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Formata CEP para exibição (00000-000).
 */
export function formatZipCodeDisplay(zipCode: string): string {
  const digits = normalizeZipCode(zipCode);
  if (digits.length !== 8) return zipCode;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
