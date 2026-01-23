import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants';
import { styles } from './styles';

type Props = {
	title: string;
	highlightText: string;
	description: string | string[];
	primaryButtonLabel: string;
	primaryButtonOnPress: () => void;
	secondaryButtonLabel: string;
	secondaryButtonOnPress: () => void;
	backgroundColor?: string;
	secondaryButtonIcon?: string;
	primaryButtonIcon?: string;
	primaryButtonIconPosition?: 'left' | 'right';
	style?: ViewStyle | ViewStyle[];
};

const CTACard: React.FC<Props> = ({
	title,
	highlightText,
	description,
	primaryButtonLabel,
	primaryButtonOnPress,
	secondaryButtonLabel,
	secondaryButtonOnPress,
	backgroundColor = COLORS.SECONDARY.PURE,
	secondaryButtonIcon,
	primaryButtonIcon,
	primaryButtonIconPosition = 'right',
	style,
}) => {
	return (
		<View style={[styles.card, { backgroundColor }, style]}>
			<Text style={styles.title}>{title}</Text>
			<View style={styles.content}>
				<Text style={styles.highlightText}>{highlightText}</Text>
				{Array.isArray(description) ? (
					description.map((text, index) => (
						<Text key={index} style={styles.description}>
							{text}
						</Text>
					))
				) : (
					<Text style={styles.description}>{description}</Text>
				)}
			</View>
			<View style={styles.actions}>
				<SecondaryButton
					label={secondaryButtonLabel}
					icon={secondaryButtonIcon}
					iconSize={24}
					onPress={secondaryButtonOnPress}
					size="large"
				/>
				<PrimaryButton
					label={primaryButtonLabel}
					icon={primaryButtonIcon}
					iconSize={24}
					iconPosition={primaryButtonIconPosition}
					onPress={primaryButtonOnPress}
					size="large"
				/>
			</View>
		</View>
	);
};

export default CTACard;

