import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#edec80',
    borderRadius: 64,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 44,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontFamily: 'DM Sans',
    fontSize: 32,
    fontWeight: '700',
    color: 'rgba(0, 17, 55, 1)',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  descriptionContainer: {
    minHeight: 150,
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%',
  },
  description: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 17, 55, 1)',
    letterSpacing: 0.2,
    lineHeight: 20,
    textAlign: 'left',
  },
  button: {
    width: '100%',
    borderRadius: 24,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
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
