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
    paddingTop: 24,
    paddingBottom: 0,
    width: '100%',
  },
  headerExpanded: {
    backgroundColor: '#fbf7e5',
    paddingTop: 16,
    paddingBottom: 8,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
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
    paddingVertical: SPACING.MD,
    gap: 24,
    width: "100%",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignSelf: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#e1dfcf',
    marginTop: 24,
    marginBottom: 8,
    width: "100%",
  },
});

