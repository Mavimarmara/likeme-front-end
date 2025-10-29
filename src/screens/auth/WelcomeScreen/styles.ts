import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Bege claro como na imagem
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    backgroundColor: '#F5F5DC',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.TEXT,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    textAlign: 'center',
    marginRight: 40, // Compensar o botão de voltar
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.XL,
  },
  
  // Welcome Section
  welcomeContainer: {
    marginBottom: SPACING.XXL,
  },
  welcomeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.MD,
  },
  questionText: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT,
    fontWeight: '400',
  },

  // Input Section
  inputContainer: {
    marginBottom: SPACING.XXL,
  },
  nameInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlign: 'center',
  },

  // Continue Button
  continueButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.LG,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: SPACING.XL,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
  },
});
