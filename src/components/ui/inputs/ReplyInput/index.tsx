import React from 'react';
import { TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { IconButton } from '@/components/ui/buttons';
import { styles } from './styles';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  sendDisabled: boolean;
  placeholder: string;
  onFocus?: () => void;
  rowStyle?: StyleProp<ViewStyle>;
  inputWrapperStyle?: StyleProp<ViewStyle>;
};

const ReplyInput: React.FC<Props> = ({
  value,
  onChangeText,
  onSend,
  sendDisabled,
  placeholder,
  onFocus,
  rowStyle,
  inputWrapperStyle,
}) => {
  return (
    <View style={[styles.row, rowStyle]}>
      <View style={[styles.textInputWrapper, inputWrapperStyle]}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor='rgba(110,106,106,0.6)'
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          multiline
          showSoftInputOnFocus
        />
      </View>

      <IconButton icon='send' variant='dark' onPress={onSend} backgroundSize='medium' disabled={sendDisabled} />
    </View>
  );
};

export default ReplyInput;
