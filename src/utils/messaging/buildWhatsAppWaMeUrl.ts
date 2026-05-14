export type BuildWhatsAppWaMeUrlParams = {
  /** Se preenchida, retornada como está (trim); ignora phone/prefillText. */
  fullUrl?: string | null;
  /** Número com ou sem máscara; só dígitos entram no path wa.me. */
  phone?: string | null;
  /** Texto opcional do parâmetro `text` (codificado). */
  prefillText?: string | null;
};

/**
 * URL `https://wa.me/<digits>` com `?text=` opcional.
 * Usado pelo suporte (env) e por contatos tipo WhatsApp (perfil provider etc.).
 */
export function buildWhatsAppWaMeUrl(params: BuildWhatsAppWaMeUrlParams): string {
  const full = params.fullUrl?.trim();
  if (full) return full;

  const digits = (params.phone ?? '').replace(/\D/g, '');
  if (!digits) return '';

  const rawText = typeof params.prefillText === 'string' ? params.prefillText.trim() : '';
  if (!rawText) return `https://wa.me/${digits}`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(rawText)}`;
}
