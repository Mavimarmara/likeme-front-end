import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: 'center',
    gap: 24,
    paddingHorizontal: SPACING.MD,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "100%",
    alignSelf: 'center',
    paddingHorizontal: SPACING.MD,
  },
  headerLeft: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#001137',
    flexWrap: 'wrap',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#001137',
    paddingVertical: 4,
    paddingHorizontal: SPACING.SM,
    borderRadius: 24,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  checkContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#8fa3a1',
  },
  checkContainerCompleted: {
    backgroundColor: '#d9ede4',
    borderRadius: 20,
  },
  content: {
    gap: SPACING.LG,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    alignSelf: 'center',
    backgroundColor: '#fbf7e5',
    paddingHorizontal: SPACING.LG,
  },
  questionContainer: {
    width: '100%',
    gap: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: '#6f6c66',
    textTransform: 'uppercase',
  },
  editButton: {
    alignSelf: 'flex-end',
    width: 120,
  },
  question: {
    fontSize: 18,
    fontWeight: '400',
    color: '#001137',
    lineHeight: 26,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
  },
  optionButton: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#8fa3a1',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
  },
  optionButtonSelected: {
    backgroundColor: '#8fa3a1',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8fa3a1',
  },
  optionTextSelected: {
    color: '#fbf7e5',
  },
  submitButton: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  submitButtonContainer: {
    width: '100%',
    paddingHorizontal: SPACING.MD,
    alignSelf: 'flex-end',
  },
});

