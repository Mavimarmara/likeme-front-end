import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, View, Text } from 'react-native';
import { styles } from './styles';

export type TextInputType = 
  | 'text' 
  | 'cardNumber' 
  | 'expiryDate' 
  | 'cvv' 
  | 'phone' 
  | 'zipCode';

interface TextInputProps extends Omit<RNTextInputProps, 'onChangeText'> {
  type?: TextInputType;
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  helperText?: string;
  error?: string;
  containerStyle?: any;
}

const TextInputComponent = React.forwardRef<RNTextInput, TextInputProps>(({
  type = 'text',
  label,
  placeholder,
  value,
  onChangeText,
  helperText,
  error,
  containerStyle,
  style,
  ...props
}, ref) => {
  const formatCardNumber = (text: string): string => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string): string => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleTextChange = (text: string) => {
    let formattedText = text;
    
    switch (type) {
      case 'cardNumber':
        formattedText = formatCardNumber(text);
        break;
      case 'expiryDate':
        formattedText = formatExpiryDate(text);
        break;
      default:
        formattedText = text;
    }
    
    onChangeText(formattedText);
  };

  const getKeyboardType = (): 'default' | 'numeric' | 'phone-pad' => {
    if (props.keyboardType) {
      return props.keyboardType;
    }
    
    switch (type) {
      case 'cardNumber':
      case 'expiryDate':
      case 'cvv':
      case 'zipCode':
        return 'numeric';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  const getSecureTextEntry = (): boolean => {
    if (props.secureTextEntry !== undefined) {
      return props.secureTextEntry;
    }
    return type === 'cvv';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputSection}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputWrapper}>
          <RNTextInput
            ref={ref}
            style={[style, styles.input]}
            placeholder={placeholder}
            placeholderTextColor="rgba(110, 106, 106, 1)"
            value={value}
            onChangeText={handleTextChange}
            keyboardType={getKeyboardType()}
            secureTextEntry={getSecureTextEntry()}
            {...props}
          />
        </View>
      </View>
      <View style={styles.helperContainer}>
        {helperText && !error && (
          <Text style={styles.helperText}>{helperText}</Text>
        )}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
    </View>
  );
});

TextInputComponent.displayName = 'TextInputComponent';

const TextInput = TextInputComponent;

export default TextInput;

