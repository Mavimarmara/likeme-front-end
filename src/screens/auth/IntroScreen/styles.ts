import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Bege claro como na imagem
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
    justifyContent: 'space-between',
  },
  
  // Greeting Section
  greetingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: SPACING.XXL,
  },
  greetingText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.MD,
  },
  welcomeText: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT,
    fontWeight: '400',
    marginBottom: SPACING.SM,
  },
  questionText: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.TEXT,
    fontWeight: '400',
  },

  // Button Section
  buttonContainer: {
    paddingBottom: SPACING.XXL,
  },
  primaryButton: {
    backgroundColor: COLORS.BLACK,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  primaryButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BLACK,
  },
  secondaryButtonText: {
    color: COLORS.TEXT,
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    textAlign: 'center',
  },
});
