import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

interface ChartBarProps {
	day: string;
	date: string;
	value: number;
	height: number;
	color: string;
}

const ChartBar: React.FC<ChartBarProps> = ({ day, date, value, height, color }) => {
	return (
		<View style={styles.container}>
			<View style={styles.barWrapper}>
				<View
					style={[
						styles.valueDot,
						{
							backgroundColor: color,
							bottom: height + 8,
						},
					]}
				>
					<Text style={styles.valueText}>{value.toString().padStart(2, '0')}</Text>
				</View>
				<View
					style={[
						styles.bar,
						{
							height: Math.max(height, 30),
							backgroundColor: color,
						},
					]}
				/>
			</View>
			<Text style={styles.dayLabel}>{day}</Text>
			<Text style={styles.dateLabel}>{date}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		position: 'relative',
		justifyContent: 'flex-end',
	},
	barWrapper: {
		width: '100%',
		height: 243,
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginBottom: SPACING.XS,
	},
	bar: {
		width: 30,
		minHeight: 30,
		borderRadius: 4,
		marginBottom: SPACING.XS,
	},
	valueDot: {
		position: 'absolute',
		alignSelf: 'center',
		width: 27,
		height: 27,
		borderRadius: 13.5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	valueText: {
		fontSize: 10,
		fontFamily: 'DM Sans',
		fontWeight: '500',
		color: COLORS.TEXT,
	},
	dayLabel: {
		fontSize: 14,
		fontFamily: 'DM Sans',
		fontWeight: '400',
		color: COLORS.BLACK,
		letterSpacing: -0.28,
		marginTop: SPACING.XS,
		textAlign: 'center',
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

export default ChartBar;

