import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackgroundIconButton } from '@/assets';
import { styles } from './styles';
import type { Community } from '@/types/community';

type Props = {
  communities: RecommendedCommunity[];
  onCommunityPress?: (community: RecommendedCommunity) => void;
};

export interface RecommendedCommunity {
  id: string;
  title: string;
  badge: string;
  image: string;
}

const RecommendedCommunitiesSection: React.FC<Props> = ({ communities, onCommunityPress }) => {
  if (!communities || communities.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Communities</Text>
      <View style={styles.communitiesList}>
        {communities.map((community) => (
          <TouchableOpacity
            key={community.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => onCommunityPress?.(community)}
          >
            <Image source={{ uri: community.image }} style={styles.cardImage} resizeMode="cover" />
            <LinearGradient
              colors={['rgba(48, 48, 48, 0)', 'rgba(41, 41, 41, 0.69)']}
              locations={[0.5, 0.69]}
              style={styles.gradient}
            />
            <View style={styles.cardContent}>
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{community.badge}</Text>
                </View>
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {community.title}
                </Text>
                <TouchableOpacity
                  style={styles.seeMoreButton}
                  activeOpacity={0.8}
                  onPress={() => onCommunityPress?.(community)}
                >
                  <ImageBackground
                    source={BackgroundIconButton}
                    style={styles.buttonBackground}
                    imageStyle={styles.buttonImage}
                  >
                    <Icon name="chevron-right" size={30} color="#001137" />
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RecommendedCommunitiesSection;
