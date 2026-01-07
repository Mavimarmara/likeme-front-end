import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

interface AnamnesisPromptCardProps {
  onStartPress: () => void;
}

const AnamnesisPromptCard: React.FC<AnamnesisPromptCardProps> = ({ onStartPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bring your avatar to life</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            By completing your anamnesis, your well-being avatar is born from your data and rhythms. Because feeling good should feel like you!
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.button}
          onPress={onStartPress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Start Anamnesis</Text>
          <Icon name="chevron-right" size={24} color="rgba(251, 247, 229, 1)" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnamnesisPromptCard;

