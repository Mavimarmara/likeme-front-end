import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		position: 'relative',
		justifyContent: 'flex-end',
	},
	barWrapper: {
		width: '100%',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginBottom: SPACING.XS,
	},
	bar: {
		width: 30,
		minHeight: 30,
		borderRadius: 12,
		marginBottom: SPACING.XS,
	},
	dateLabel: {
		fontSize: 12,
		fontFamily: 'DM Sans',
		fontWeight: '400',
		color: COLORS.TEXT_LIGHT,
		letterSpacing: -0.24,
		textAlign: 'center',
		marginTop: 2,
		lineHeight: 12.6,
	},
});

