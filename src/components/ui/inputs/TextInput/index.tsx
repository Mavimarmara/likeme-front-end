import { forwardRef } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, View, Text, ViewStyle } from 'react-native';
import { styles, PLACEHOLDER_TEXT_COLOR } from './styles';

interface TextInputProps extends Omit<RNTextInputProps, 'onChangeText'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  helperText?: string;
  errorText?: string;
  containerStyle?: ViewStyle;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, value, onChangeText, helperText, errorText, containerStyle, style, ...props }, ref) => {
    const hasHelperContent = !!(helperText || errorText);

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
            {helperText && !errorText && <Text style={styles.helperText}>{helperText}</Text>}
            {errorText && <Text style={styles.errorText}>{errorText}</Text>}
          </View>
        )}
      </View>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
