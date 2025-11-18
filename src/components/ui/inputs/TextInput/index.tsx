import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, TextInputProps, View, Text } from 'react-native';
import { styles } from './styles';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

const TextInput = forwardRef<RNTextInput, CustomTextInputProps>(({
  label,
  error,
  containerStyle,
  style,
  ...props
}, ref) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <RNTextInput
          ref={ref}
          style={[style, styles.input]}
          placeholderTextColor="rgba(110, 106, 106, 1)"
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
