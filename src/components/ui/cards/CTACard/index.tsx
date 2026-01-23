import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants';
import { styles } from './styles';

type Props = {
	title: string;
	highlightText?: string;
	description: string | string[];
	primaryButtonLabel?: string;
	primaryButtonOnPress?: () => void;
	secondaryButtonLabel?: string;
	secondaryButtonOnPress?: () => void;
	backgroundColor?: string;
	secondaryButtonIcon?: string;
	primaryButtonIcon?: string;
	primaryButtonIconPosition?: 'left' | 'right';
	descriptionColor?: string;
	borderRadius?: {
		topLeft?: number;
		topRight?: number;
		bottomLeft?: number;
		bottomRight?: number;
	};
	titleStyle?: TextStyle;
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
	descriptionColor,
	borderRadius,
	titleStyle,
	style,
}) => {
	const hasPrimaryButton = primaryButtonLabel && primaryButtonOnPress;
	const hasSecondaryButton = secondaryButtonLabel && secondaryButtonOnPress;
	const hasSingleButton = (hasPrimaryButton && !hasSecondaryButton) || (!hasPrimaryButton && hasSecondaryButton);

	const customBorderRadius = borderRadius
		? {
				borderTopLeftRadius: borderRadius.topLeft,
				borderTopRightRadius: borderRadius.topRight,
				borderBottomLeftRadius: borderRadius.bottomLeft,
				borderBottomRightRadius: borderRadius.bottomRight,
			}
		: {};

	return (
		<View style={[styles.card, { backgroundColor }, customBorderRadius, style]}>
			<Text style={[styles.title, titleStyle]}>{title}</Text>
			<View style={styles.content}>
				{highlightText && <Text style={styles.highlightText}>{highlightText}</Text>}
				{Array.isArray(description) ? (
					description.map((text, index) => (
						<Text key={index} style={[styles.description, descriptionColor && { color: descriptionColor }]}>
							{text}
						</Text>
					))
				) : (
					<Text style={[styles.description, descriptionColor && { color: descriptionColor }]}>
						{description}
					</Text>
				)}
			</View>
			{(hasPrimaryButton || hasSecondaryButton) && (
				<View style={[styles.actions, hasSingleButton && styles.actionsSingle]}>
					{hasSecondaryButton && (
						<SecondaryButton
							label={secondaryButtonLabel!}
							icon={secondaryButtonIcon}
							iconSize={24}
							onPress={secondaryButtonOnPress!}
							size="large"
							style={hasSingleButton && styles.singleButton}
						/>
					)}
					{hasPrimaryButton && (
						<PrimaryButton
							label={primaryButtonLabel!}
							icon={primaryButtonIcon}
							iconSize={24}
							iconPosition={primaryButtonIconPosition}
							onPress={primaryButtonOnPress!}
							size="large"
							style={hasSingleButton && styles.singleButton}
						/>
					)}
				</View>
			)}
		</View>
	);
};

export default CTACard;

