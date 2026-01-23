/**
 * Generic date/time sorter utility
 * Can be used to sort any array of objects by a date/time field
 */

export type SortOrder = 'asc' | 'desc';

export interface SortableByDateTime {
  dateTime?: string | null;
  [key: string]: any;
}

/**
 * Generic function to sort an array by dateTime field
 * @param items - Array of items with optional dateTime field
 * @param order - Sort order ('asc' or 'desc')
 * @param dateTimeExtractor - Optional function to extract dateTime from item (default: item.dateTime)
 * @returns Sorted array
 */
export function sortByDateTime<T extends SortableByDateTime>(
  items: T[],
  order: SortOrder = 'desc',
  dateTimeExtractor?: (item: T) => string | null | undefined
): T[] {
  const sorted = [...items].sort((a, b) => {
    const dateA = parseDateTime(a, dateTimeExtractor);
    const dateB = parseDateTime(b, dateTimeExtractor);
    if (dateA === dateB) {
      return 0;
    }
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
  return sorted;
}

/**
 * Parse dateTime string to timestamp
 * Returns 0 if dateTime is invalid or missing
 */
function parseDateTime<T extends SortableByDateTime>(
  item: T,
  extractor?: (item: T) => string | null | undefined
): number {
  const dateTime = extractor ? extractor(item) : item.dateTime;
  if (!dateTime) {
    return 0;
  }
  const parsed = new Date(dateTime);
  if (isNaN(parsed.getTime())) {
    return 0;
  }
  return parsed.getTime();
}

/**
 * Sort by a specific date field (e.g., createdAt, updatedAt, startDate)
 * @param items - Array of items
 * @param dateField - Field name containing the date string
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortByDateField<T extends Record<string, any>>(
  items: T[],
  dateField: keyof T,
  order: SortOrder = 'desc'
): T[] {
  return sortByDateTime(
    items as T[],
    order,
    (item) => item[dateField] as string | null | undefined
  );
}

/**
 * Sort by a Date object field (e.g., createdAt as Date)
 * @param items - Array of items
 * @param dateField - Field name containing the Date object
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortByDateObject<T extends Record<string, any>>(
  items: T[],
  dateField: keyof T,
  order: SortOrder = 'desc'
): T[] {
  const sorted = [...items].sort((a, b) => {
    const dateA = a[dateField] as Date | null | undefined;
    const dateB = b[dateField] as Date | null | undefined;

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    const timeA = dateA.getTime();
    const timeB = dateB.getTime();

    if (timeA === timeB) return 0;
    return order === 'asc' ? timeA - timeB : timeB - timeA;
  });
  return sorted;
}
