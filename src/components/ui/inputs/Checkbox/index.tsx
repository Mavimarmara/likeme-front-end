import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Icon name='check' size={14} color='#0154f8' />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Checkbox;
