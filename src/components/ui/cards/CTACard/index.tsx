import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { COLORS } from '@/constants';
import { styles } from './styles';

type Props = {
  children?: React.ReactNode;
  title?: string;
  highlightText?: string;
  description?: string | string[];
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
  children,
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
  const hasActions = hasPrimaryButton || hasSecondaryButton;
  const hasDefaultContent = title != null || description != null;

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
      {children != null ? (
        <View style={styles.content}>{children}</View>
      ) : hasDefaultContent ? (
        <>
          {title != null && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          <View style={styles.content}>
            {highlightText && <Text style={styles.highlightText}>{highlightText}</Text>}
            {description != null &&
              (Array.isArray(description) ? (
                description.map((text, index) => (
                  <Text key={index} style={[styles.description, descriptionColor && { color: descriptionColor }]}>
                    {text}
                  </Text>
                ))
              ) : (
                <Text style={[styles.description, descriptionColor && { color: descriptionColor }]}>{description}</Text>
              ))}
          </View>
        </>
      ) : null}
      {hasActions && (
        <View style={[styles.actions, hasSingleButton && styles.actionsSingle]}>
          {hasSecondaryButton && (
            <SecondaryButton
              label={secondaryButtonLabel!}
              icon={secondaryButtonIcon}
              iconSize={24}
              onPress={secondaryButtonOnPress!}
              size='large'
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
              size='large'
              style={hasSingleButton && styles.singleButton}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default CTACard;
