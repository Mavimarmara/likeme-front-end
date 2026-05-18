import { Image } from 'expo-image';
import { logger } from '@/utils/logger';

/**
 * Pré-baixa um conjunto de URIs (remotos) usando o pipeline do `expo-image`,
 * gravando em cache de disco para que a primeira renderização do `Image` no
 * componente seja instantânea (sem flash branco).
 *
 * Falhas individuais são apenas logadas; a função nunca rejeita.
 */
export async function prefetchImageUris(uris: ReadonlyArray<string | null | undefined>): Promise<void> {
  const cleaned = Array.from(
    new Set(
      uris
        .map((uri) => (typeof uri === 'string' ? uri.trim() : ''))
        .filter((uri): uri is string => uri.length > 0 && /^https?:\/\//i.test(uri)),
    ),
  );

  if (cleaned.length === 0) return;

  try {
    await Image.prefetch(cleaned, 'memory-disk');
  } catch (cause) {
    logger.warn('[image] prefetch falhou', { uris: cleaned, cause });
  }
}
