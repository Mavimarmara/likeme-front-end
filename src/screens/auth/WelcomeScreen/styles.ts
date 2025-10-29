import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  
  content: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 40,
    position: 'relative',
    width: 362,
    alignSelf: 'center',
    paddingTop: 60,
  },
  
  inputContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  
});