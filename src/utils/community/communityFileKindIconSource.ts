import type { ImageSourcePropType } from 'react-native';
import type { PostAttachmentKind } from '@/types';

const FILE_KIND_ICON = {
  pdf: require('../../../assets/community/file-kinds/pdf.png'),
  spreadsheet: require('../../../assets/community/file-kinds/spreadsheet.png'),
  document: require('../../../assets/community/file-kinds/document.png'),
  generic: require('../../../assets/community/file-kinds/generic.png'),
} as const;

export function communityFileKindIconSource(kind: PostAttachmentKind): ImageSourcePropType {
  if (kind === 'pdf') return FILE_KIND_ICON.pdf;
  if (kind === 'spreadsheet') return FILE_KIND_ICON.spreadsheet;
  if (kind === 'document') return FILE_KIND_ICON.document;
  return FILE_KIND_ICON.generic;
}
