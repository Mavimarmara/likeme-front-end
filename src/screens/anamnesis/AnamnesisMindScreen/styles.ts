import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY.PURE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 18,
  },
  title: {
    fontFamily: 'Bricolage Grotesque',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: '400',
    color: COLORS.TEXT,
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.TEXT_LIGHT,
    letterSpacing: 0.2,
    lineHeight: 20,
    textAlign: 'center',
  },
  questionsContainer: {
    gap: 16,
  },
  questionSection: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.NEUTRAL.LOW.LIGHT,
    paddingBottom: 16,
    gap: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionNumber: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.TEXT,
    letterSpacing: 0.2,
    marginRight: 4,
  },
  questionTextContainer: {
    flex: 1,
  },
  questionTitle: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 0,
  },
  finishButton: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.TEXT,
  },
});

