import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Bege claro como na imagem
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  

  // Content - seguindo exatamente o design do Figma
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
  
  // Text Container - baseado no .text do Figma
  textContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flex: 0,
    flexDirection: 'column',
    gap: 16,
    position: 'relative',
    width: 362,
  },
  
  // Welcome Text - baseado no .text-wrapper do Figma
  welcomeText: {
    alignItems: 'center',
    alignSelf: 'stretch',
    color: 'rgba(0, 17, 55, 1)',
    display: 'flex',
    fontFamily: 'Bricolage Grotesque',
    fontSize: 48,
    fontWeight: '700',
    height: 57,
    justifyContent: 'center',
    letterSpacing: 0,
    lineHeight: 16,
    marginTop: -1,
    position: 'relative',
  },
  
  // Question Text - baseado no .div do Figma
  questionText: {
    alignItems: 'center',
    alignSelf: 'stretch',
    color: 'rgba(0, 17, 55, 1)',
    display: 'flex',
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: '400',
    justifyContent: 'center',
    letterSpacing: 0,
    lineHeight: 25,
    position: 'relative',
  },
  
  // Input Container - baseado no .input do Figma
  inputContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flex: 0,
    flexDirection: 'column',
    gap: 8,
    position: 'relative',
    width: 362,
  },
  
  // Input Frame - baseado no .frame do Figma
  inputFrame: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    display: 'flex',
    flex: 0,
    flexDirection: 'column',
    gap: 8,
    position: 'relative',
    width: '100%',
  },
  
  // Name Input - baseado no .input-box do Figma
  nameInput: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(253, 251, 238, 1)', // --functional-colors-main-colors-secondary-secondary-light
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4, // Para Android
    color: 'rgba(110, 106, 106, 1)', // --functional-colors-neutral-colors-low-low-dark
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 20,
    marginRight: -27.61,
    marginTop: -1,
    padding: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  
  // Input Spacer - baseado no .frame-2 do Figma
  inputSpacer: {
    height: 20,
    position: 'relative',
    width: 358,
  },
  
  // Continue Button
  continueButton: {
    backgroundColor: 'rgba(0, 17, 55, 1)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
    minWidth: 200,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(178, 178, 178, 1)',
    opacity: 0.6,
  },
  continueButtonText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
});