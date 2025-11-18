import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { styles } from './styles';

export interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message,
  size = 'large',
  fullScreen = false,
  color = '#1E3A8A',
}) => {
  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.inlineContainer;
  const contentStyle = fullScreen ? styles.fullScreenContent : styles.inlineContent;

  return (
    <View style={containerStyle}>
      <View style={contentStyle}>
        <ActivityIndicator size={size} color={color} />
        {message && (
          <Text style={styles.message}>{message}</Text>
        )}
      </View>
    </View>
  );
};

export default Loading;

