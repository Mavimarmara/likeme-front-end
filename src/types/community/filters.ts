export type PublicationDateFilter = 'today' | 'week' | 'month' | 'all';

export type SortByFilter = 'recent' | 'oldest' | 'popular';

export interface CommunityFeedFilters {
  postType?: string[];
  publicationDate?: PublicationDateFilter;
  sortBy?: SortByFilter;
  author?: string;
}
