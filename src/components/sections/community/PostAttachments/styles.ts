import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const attachmentStyles = StyleSheet.create({
  container: {
    marginTop: SPACING.SM,
    gap: SPACING.SM,
  },
  mediaContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e8e4d4',
    maxHeight: 320,
  },
  mediaImage: {
    width: '100%',
    height: 200,
  },
  mediaImageExpanded: {
    width: '100%',
    height: 240,
  },
  videoPosterInner: {
    position: 'relative',
    width: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  videoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.XS,
  },
  imageGridSingle: {
    width: '100%',
  },
  imageGridHalf: {
    width: '49%',
    aspectRatio: 1,
  },
  imageGridCell: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e8e4d4',
  },
  imageGridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 17, 55, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGridOverlayText: {
    color: COLORS.WHITE,
    fontSize: 20,
    fontWeight: '600',
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1dfcf',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD_PLUS,
  },
  fileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f4f3ec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileTextWrap: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT,
  },
  fileExtension: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.TEXT_LIGHT,
    textTransform: 'uppercase',
  },
  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
  },
  fullscreenClose: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 8,
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
  },
});
