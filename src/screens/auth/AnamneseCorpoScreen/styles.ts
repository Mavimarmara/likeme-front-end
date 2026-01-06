import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf7e5',
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
    color: 'rgba(0, 17, 55, 1)',
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: '400',
    color: 'rgba(0, 17, 55, 1)',
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(110, 106, 106, 1)',
    letterSpacing: 0.2,
    lineHeight: 20,
    textAlign: 'center',
  },
  questionsContainer: {
    gap: 16,
  },
  questionSection: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217, 217, 217, 1)',
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
    color: 'rgba(0, 17, 55, 1)',
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
    color: 'rgba(0, 17, 55, 1)',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  questionDescription: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 17, 55, 1)',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 0,
  },
  finishButton: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});

