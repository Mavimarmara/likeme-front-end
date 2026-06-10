import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const FILE_COLUMN_WIDTH = 156;

export const attachmentStyles = StyleSheet.create({
  container: {
    marginTop: SPACING.SM,
    gap: SPACING.SM,
  },
  mediaImageBlock: {
    marginBottom: SPACING.GAP_20,
  },
  mediaContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e8e4d4',
  },
  mediaContainerVideo: {
    marginTop: SPACING.SM,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e8e4d4',
  },
  mediaContainerCompact: {
    marginTop: SPACING.XS,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e8e4d4',
  },
  postAttachmentImage: {
    width: '100%',
  },
  postAttachmentImageLoading: {
    minHeight: 120,
  },
  videoPosterPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#2a2a2a',
  },
  videoPosterInner: {
    position: 'relative',
    width: '100%',
  },
  videoPlayerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  mixedRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: SPACING.SM,
  },
  mixedRowMedia: {
    flex: 1,
    minWidth: 0,
  },
  mixedRowFiles: {
    width: FILE_COLUMN_WIDTH,
    gap: SPACING.XS,
    justifyContent: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.XS,
  },
  imageGridPair: {
    width: '49%',
    aspectRatio: 1,
  },
  imageGridTripleMain: {
    width: '66%',
    aspectRatio: 2 / 3,
  },
  imageGridTripleSide: {
    width: '32%',
    aspectRatio: 2 / 3,
    gap: SPACING.XS,
  },
  imageGridTripleSideCell: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e8e4d4',
  },
  imageGridQuad: {
    width: '49%',
    aspectRatio: 1,
  },
  imageGridCell: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e8e4d4',
  },
  mediaVideoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    minHeight: 200,
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
  fileCardCompact: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.SM,
    borderRadius: 12,
    flex: 1,
  },
  fileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIconWrapCompact: {
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  fileTextWrap: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  fileTextWrapCompact: {
    flex: 0,
    width: '100%',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT,
  },
  fileNameCompact: {
    fontSize: 11,
    lineHeight: 14,
  },
  fileExtension: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.TEXT_LIGHT,
    textTransform: 'uppercase',
  },
  fileExtensionCompact: {
    fontSize: 10,
  },
  fileList: {
    gap: SPACING.SM,
  },
  fileActionIcon: {
    marginLeft: 'auto',
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
  fullscreenNav: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 8,
  },
  fullscreenNavPrevious: {
    left: 12,
  },
  fullscreenNavNext: {
    right: 12,
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
  },
  fullscreenCounter: {
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
});
