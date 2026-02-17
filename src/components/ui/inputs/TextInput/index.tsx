import { forwardRef } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, View, Text, ViewStyle } from 'react-native';
import { styles, PLACEHOLDER_TEXT_COLOR } from './styles';

interface TextInputProps extends Omit<RNTextInputProps, 'onChangeText'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  helperText?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, value, onChangeText, helperText, error, containerStyle, style, ...props }, ref) => {
    const hasHelperContent = !!(helperText || error);

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.inputSection}>
          {label && <Text style={styles.label}>{label}</Text>}
          <View style={styles.inputWrapper}>
            <RNTextInput
              ref={ref}
              style={[style, styles.input]}
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              value={value}
              onChangeText={onChangeText}
              {...props}
            />
          </View>
        </View>
        {hasHelperContent && (
          <View style={styles.helperContainer}>
            {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        )}
      </View>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
