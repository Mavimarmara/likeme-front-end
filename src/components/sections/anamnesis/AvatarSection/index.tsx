import React from 'react';
import { View, Text, Image } from 'react-native';
import { MindAvatar, BodyAvatar } from '@/assets';
import { styles } from './styles';

const AvatarSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Avatar</Text>
      <View style={styles.avatarsContainer}>
        <View style={styles.avatarItem}>
          <Text style={styles.avatarLabel}>MIND</Text>
          <Image
            source={MindAvatar}
            style={styles.mindAvatar}
            resizeMode="cover"
          />
        </View>
        <View style={styles.avatarItem}>
          <Image
            source={BodyAvatar}
            style={styles.bodyAvatar}
            resizeMode="cover"
          />
          <Text style={styles.avatarLabel}>BODY</Text>
        </View>
      </View>
    </View>
  );
};

export default AvatarSection;

