import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ButtonGroup, SecondaryButton } from '@/components/ui/buttons';
import { COLORS, BORDER_RADIUS, SPACING } from '@/constants';
import { styles } from './styles';

type PeriodOption = 'day' | 'week' | 'month';

type Props = {
	selectedPeriod: PeriodOption;
	onPeriodChange: (period: PeriodOption) => void;
	options?: PeriodOption[];
	activeColor?: string;
	style?: ViewStyle | ViewStyle[];
};

const PeriodSelector: React.FC<Props> = ({
	selectedPeriod,
	onPeriodChange,
	options = ['week', 'month'],
	activeColor = COLORS.PRIMARY.PURE,
	style,
}) => {
	const flattenedStyle = style ? StyleSheet.flatten([styles.container, style]) : styles.container;
	return (
		<ButtonGroup style={flattenedStyle} direction="horizontal">
			{options.map((option) => {
				const isActive = selectedPeriod === option;
				return (
					<SecondaryButton
						key={option}
						label={option.charAt(0).toUpperCase() + option.slice(1)}
						onPress={() => onPeriodChange(option)}
						size="medium"
						style={isActive ? [styles.buttonActive, { borderColor: activeColor }] : undefined}
						labelStyle={isActive ? [styles.buttonTextActive, { color: activeColor }] : undefined}
					/>
				);
			})}
		</ButtonGroup>
	);
};

export default PeriodSelector;

