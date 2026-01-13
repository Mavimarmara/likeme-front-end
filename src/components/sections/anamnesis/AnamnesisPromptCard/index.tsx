import React from 'react';
import { View, Text } from 'react-native';
import { PrimaryButton } from '@/components/ui/buttons';
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
        <PrimaryButton
          label="Start Anamnesis"
          onPress={onStartPress}
          size="large"
          icon="chevron-right"
          iconPosition="right"
          iconSize={24}
          style={styles.button}
        />
      </View>
    </View>
  );
};

export default AnamnesisPromptCard;

