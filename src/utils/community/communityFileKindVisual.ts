import { COLORS } from '@/constants';
import type { PostAttachmentKind } from '@/types';

export type CommunityFileKindVisual = {
  iconBackground: string;
  iconColor: string;
};

const SPREADSHEET_GREEN = '#217346';

export function communityFileKindVisual(kind: PostAttachmentKind): CommunityFileKindVisual {
  switch (kind) {
    case 'pdf':
      return { iconBackground: '#FDE8ED', iconColor: COLORS.ERROR };
    case 'spreadsheet':
      return { iconBackground: '#E3F2E8', iconColor: SPREADSHEET_GREEN };
    case 'document':
      return { iconBackground: '#E8EEFD', iconColor: COLORS.INFO };
    default:
      return { iconBackground: COLORS.NEUTRAL.HIGH.PURE, iconColor: COLORS.TEXT };
  }
}
