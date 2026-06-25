export function withMarketplaceFeaturedBadge(
  badges: readonly string[],
  isFeatured: boolean | undefined,
  featuredLabel: string,
): string[] {
  if (!isFeatured || featuredLabel.trim() === '') {
    return [...badges];
  }
  return [featuredLabel, ...badges];
}
