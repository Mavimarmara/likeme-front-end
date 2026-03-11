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
  suffix?: string;
  /** Quando true, exibe asterisco ao lado do label (campo obrigatório). Padrão: false. */
  required?: boolean;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    { label, value, onChangeText, helperText, errorText, containerStyle, style, suffix, required = false, ...props },
    ref,
  ) => {
    const hasHelperContent = !!(helperText || errorText);

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.inputSection}>
          {label && (
            <View style={styles.labelRow}>
              <Text style={styles.label}>{label}</Text>
              {required && <Text style={styles.requiredMark}> *</Text>}
            </View>
          )}
          <View style={[styles.inputWrapper, suffix ? styles.inputWrapperRow : undefined]}>
            <RNTextInput
              ref={ref}
              style={[style, styles.input, suffix ? styles.inputWithSuffix : undefined]}
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              value={value}
              onChangeText={onChangeText}
              {...props}
            />
            {suffix != null && suffix !== '' ? <Text style={styles.suffix}>{suffix}</Text> : null}
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
