import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8e4d6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  headerText: {
    marginTop: 32,
    gap: 8,
    paddingHorizontal: 18,
  },
  screenTitle: {
    fontFamily: 'Bricolage Grotesque',
    fontSize: 24,
    fontWeight: '700',
    color: '#001137',
    textTransform: 'uppercase',
  },
  screenSubtitle: {
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: '400',
    color: '#001137',
  },
  screenDescription: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    color: '#6e6a6a',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  card: {
    marginTop: 32,
    backgroundColor: '#fbf7e5',
    borderRadius: 28,
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTop: {
    gap: 8,
  },
  cardTopicTitle: {
    fontFamily: 'Bricolage Grotesque',
    fontSize: 25,
    fontWeight: '700',
    color: '#001137',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardProgress: {
    fontFamily: 'Bricolage Grotesque',
    fontSize: 48,
    fontWeight: '700',
    color: '#001137',
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardQuestionText: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  loadingCard: {
    marginTop: 24,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    marginTop: 24,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  emptyStateText: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    color: '#6e6a6a',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 24,
    gap: 8,
  },
  optionButton: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: 'rgba(143,163,161,0.8)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 24,
    paddingVertical: 8,
    justifyContent: 'center',
    backgroundColor: '#fbf7e5',
  },
  optionButtonSelected: {
    backgroundColor: '#edec80',
    borderColor: '#8fa3a1',
  },
  optionText: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '500',
    color: '#8fa3a1',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#001137',
    textAlign: 'left',
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});


