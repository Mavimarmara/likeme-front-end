import { MARKER_NAMES } from '@/constants/markers';
import { NAME_TO_CATEGORY_ID, type CategoryName } from '@/types/category';

export function getMarkerIdForCategory(categoryId: string, name: string): CategoryName | null {
  const key = (categoryId || name).toLowerCase().trim().replace(/\s+/g, '-');
  if (NAME_TO_CATEGORY_ID[key]) return NAME_TO_CATEGORY_ID[key];
  const nameKey = name.toLowerCase().trim().replace(/\s+/g, ' ');
  if (NAME_TO_CATEGORY_ID[nameKey]) return NAME_TO_CATEGORY_ID[nameKey];
  return (key in MARKER_NAMES ? key : null) as CategoryName | null;
}
