import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    position: 'relative',
    width: '100%',
  },
  
  label: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
  },
  
  inputWrapper: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    display: 'flex',
    flex: 0,
    flexDirection: 'column',
    gap: 8,
    position: 'relative',
    width: '100%',
  },
  
  input: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(253, 251, 238, 1)',
    borderWidth: 0,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    color: 'rgba(110, 106, 106, 1)',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 20,
    marginRight: -27.61,
    marginTop: -1,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    position: 'relative',
    width: '100%',
    height: 42,
  },
  
  spacer: {
    height: 20,
    position: 'relative',
    width: 358,
  },
  
  errorText: {
    color: '#FF6B6B',
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 16,
  },
});
