export function communitiesListCacheKey(paramsKey: string, pageSize: number): string {
  return `communities::${pageSize}::${paramsKey}`;
}
