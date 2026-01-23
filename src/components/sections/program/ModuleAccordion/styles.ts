import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingRight: SPACING.MD,
    paddingTop: SPACING.MD,
    width: '100%',
  },
  headerExpanded: {
    backgroundColor: '#fbf7e5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
    flex: 1,
  },
  checkContainer: {
    width: 30,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#001137',
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#001137',
    lineHeight: 24,
  },
  content: {
    backgroundColor: '#fbf7e5',
    paddingVertical: 16,
    gap: SPACING.LG,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  separator: {
    height: 1,
    backgroundColor: '#E1DFCF',
    marginTop: 24,
  },
});
