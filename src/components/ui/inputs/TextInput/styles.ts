import { StyleSheet } from 'react-native';

export const PLACEHOLDER_TEXT_COLOR = 'rgba(110, 106, 106, 1)';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
  },

  inputSection: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    position: 'relative',
    width: '100%',
  },

  label: {
    color: '#001137',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 22,
  },

  inputWrapper: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
  },

  input: {
    alignSelf: 'stretch',
    backgroundColor: '#fdfbee',
    borderWidth: 0,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    color: '#6e6a6a',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 20,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    position: 'relative',
    width: '100%',
    minHeight: 42,
  },

  helperContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    minHeight: 20,
    justifyContent: 'flex-start',
    position: 'relative',
    width: '100%',
  },

  helperText: {
    color: '#6e6a6a',
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 22,
  },

  errorText: {
    color: '#e30f3c',
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: 'right',
    flex: 1,
  },
});
