import React from 'react';
import { TextInput, View } from 'react-native';
import { IconButton } from '@/components/ui/buttons';
import { styles } from './styles';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  sendDisabled: boolean;
  placeholder: string;
};

const ReplyInput: React.FC<Props> = ({ value, onChangeText, onSend, sendDisabled, placeholder }) => {
  return (
    <View style={styles.row}>
      <View style={styles.textInputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor='rgba(110,106,106,0.6)'
          value={value}
          onChangeText={onChangeText}
          multiline
        />
      </View>

      <IconButton icon='send' variant='dark' onPress={onSend} backgroundSize='medium' disabled={sendDisabled} />
    </View>
  );
};

export default ReplyInput;
