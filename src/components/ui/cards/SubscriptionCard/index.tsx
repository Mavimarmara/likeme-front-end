import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { styles } from './styles';

type Props = {
  title: string;
  image: string;
  badges?: string[];
  onPress: () => void;
  testID?: string;
};

const SubscriptionCard = ({ title, image, badges = [], onPress, testID }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85} testID={testID}>
      <CachedImage source={{ uri: image }} style={styles.image} />
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,17,55,0.7)']} locations={[0.3, 1]} style={styles.gradient} />
      <View style={styles.content}>
        {badges.length > 0 && (
          <View style={styles.badgesRow}>
            {badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.footer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.chevronCircle}>
            <Icon name='chevron-right' size={24} color='#001137' />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SubscriptionCard;
