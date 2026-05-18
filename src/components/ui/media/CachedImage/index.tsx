import React from 'react';
import { Image, type ImageProps, type ImageSource } from 'expo-image';
import { IMAGE_CACHE_POLICY, IMAGE_TRANSITION_MS } from '@/constants';

/**
 * Wrapper de `expo-image` com os defaults do app:
 *
 * - `cachePolicy='memory-disk'` (cache nativo entre sessões)
 * - `transition` curto para evitar pisca branco quando a decodificação não é instantânea
 * - `contentFit='cover'` (padrão dominante; passe explicitamente quando precisar de `contain`)
 * - `recyclingKey` derivado da URI (estabiliza o reuso da view dentro de listas)
 *
 * Cada default pode ser sobrescrito pela prop equivalente.
 */
function getRecyclingKeyFromSource(source: ImageProps['source']): string | undefined {
  if (source == null) return undefined;
  if (typeof source === 'string') return source;
  if (Array.isArray(source)) {
    const first = source[0];
    if (first && typeof first === 'object' && typeof (first as ImageSource).uri === 'string') {
      return (first as ImageSource).uri;
    }
    return undefined;
  }
  if (typeof source === 'object' && 'uri' in source && typeof source.uri === 'string') {
    return source.uri;
  }
  return undefined;
}

export const CachedImage: React.FC<ImageProps> = ({
  source,
  contentFit = 'cover',
  cachePolicy = IMAGE_CACHE_POLICY,
  transition = IMAGE_TRANSITION_MS,
  recyclingKey,
  ...rest
}) => {
  const resolvedRecyclingKey = recyclingKey ?? getRecyclingKeyFromSource(source);
  return (
    <Image
      source={source}
      contentFit={contentFit}
      cachePolicy={cachePolicy}
      transition={transition}
      recyclingKey={resolvedRecyclingKey}
      {...rest}
    />
  );
};
