import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

interface ChartBarProps {
	date: string;
	value: number;
	height: number;
	gradientColors?: readonly [string, string, ...string[]];
	color?: string;
}

const ChartBar: React.FC<ChartBarProps> = ({ date, value, height, gradientColors, color }) => {
	const useGradient = gradientColors && gradientColors.length > 0;
	const barHeight = Math.max(height, 30);

	return (
		<View style={styles.container}>
			<View style={styles.barWrapper}>
				{useGradient ? (
					<LinearGradient
						colors={[...gradientColors]}
						start={{ x: 0, y: 1 }}
						end={{ x: 0, y: 0 }}
						style={[styles.bar, { height: barHeight }]}
					/>
				) : (
					<View
						style={[
							styles.bar,
							{
								height: barHeight,
								backgroundColor: color || '#001137',
							},
						]}
					/>
				)}
			</View>
			<Text style={styles.dateLabel}>{date}</Text>
		</View>
	);
};

export default ChartBar;

