import type { CommunityFeedFilters, PublicationDateFilter, SortByFilter } from '@/types/community/filters';
import type { UserFeedParams } from '@/types/community';

type FeedQueryParams = Partial<Omit<UserFeedParams, 'page' | 'limit' | 'search'>>;

const getDateRangeForFilter = (filter?: PublicationDateFilter | null) => {
  if (!filter || filter === 'all') {
    return null;
  }

  const now = new Date();
  const endDate = now.toISOString();
  const startDate = new Date(now);

  switch (filter) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    default:
      return null;
  }

  return {
    startDate: startDate.toISOString(),
    endDate,
  };
};

const mapSortFilter = (sortBy?: SortByFilter): Pick<UserFeedParams, 'orderBy' | 'order'> => {
  switch (sortBy) {
    case 'recent':
      return { orderBy: 'createdAt', order: 'desc' };
    case 'oldest':
      return { orderBy: 'createdAt', order: 'asc' };
    case 'popular':
      return { orderBy: 'reactionsCount', order: 'desc' };
    default:
      return {};
  }
};

export const mapFiltersToFeedParams = (filters?: CommunityFeedFilters | null): FeedQueryParams => {
  if (!filters) {
    return {};
  }

  const query: FeedQueryParams = {};

  if (filters.postType && filters.postType.length > 0) {
    query.postTypes = filters.postType;
  }

  if (filters.author && filters.author.trim().length > 0) {
    const authorIds = filters.author
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (authorIds.length === 1) {
      query.authorIds = authorIds[0];
    } else if (authorIds.length > 1) {
      query.authorIds = authorIds;
    }
  }

  const dateRange = getDateRangeForFilter(filters.publicationDate);
  if (dateRange) {
    query.startDate = dateRange.startDate;
    query.endDate = dateRange.endDate;
  }

  const sortParams = mapSortFilter(filters.sortBy);
  Object.assign(query, sortParams);

  return query;
};
