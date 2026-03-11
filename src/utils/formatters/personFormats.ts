/** Máscara de data de nascimento para exibição/input. */
export const BIRTHDATE_MASK = 'DD/MM/AAAA';

/** Extrai só números e um separador decimal para peso. */
export function parseWeightInput(text: string): string {
  const cleaned = text.replace(/[^\d,.]/g, '').replace(',', '.');
  const parts = cleaned.split('.');
  if (parts.length <= 1) return parts[0] ?? '';
  return `${parts[0]}.${parts.slice(1).join('').slice(0, 1)}`;
}

/** Formata digitação de altura como X,XX (vírgula decimal). */
export function parseHeightInput(text: string): string {
  const cleaned = text.replace(/[^\d,]/g, '');
  const hasComma = cleaned.includes(',');
  if (hasComma) {
    const [intPart, decPart = ''] = cleaned.split(',');
    const a = (intPart ?? '').slice(0, 2);
    const b = (decPart ?? '').slice(0, 2).padEnd(2, '0').slice(0, 2);
    return a ? `${a},${b}` : '';
  }
  if (cleaned.length <= 2) return cleaned;
  const asMeters = cleaned.slice(0, 4);
  const intPart = asMeters.slice(0, -2) || '0';
  const decPart = asMeters.slice(-2);
  return `${intPart},${decPart}`;
}

/** Aplica máscara DD/MM/AAAA: só dígitos, insere / após 2 e 5 caracteres. */
export function formatBirthdateInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** Converte DD/MM/AAAA para ISO YYYY-MM-DD ou null se inválido. */
export function birthdateToISO(masked: string): string | null {
  const digits = masked.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2100) return null;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return `${year}-${month}-${day}`;
}

/** Idade em anos a partir de string ISO (YYYY-MM-DD). */
export function ageFromBirthdateISO(iso: string): number | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
  return age;
}

/** Converte ISO (YYYY-MM-DD) para DD/MM/AAAA para exibição. */
export function isoToBirthdateMask(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return '';
  return `${match[3]}/${match[2]}/${match[1]}`;
}
