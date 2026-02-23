import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BlurCard from '@/components/ui/cards/BlurCard';
import { BackgroundIconButton } from '@/assets';
import { styles } from './styles';

export type JoinCommunity = {
  id: string;
  title: string;
  badge: string;
  image: string;
};

type Props = {
  communities: JoinCommunity[];
  onCommunityPress?: (community: JoinCommunity) => void;
};

const JoinCommunityCard: React.FC<Props> = ({ communities, onCommunityPress }) => {
  if (!communities || communities.length === 0) return null;

  const renderCard = (community: JoinCommunity) => {
    const handlePress = () => onCommunityPress?.(community);

    const topSection = (
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{community.badge}</Text>
        </View>
      </View>
    );

    const footerSection = (
      <View style={styles.bottom}>
        <Text style={styles.title} numberOfLines={2}>
          {community.title}
        </Text>
        <TouchableOpacity style={styles.seeMoreButton} activeOpacity={0.8} onPress={handlePress}>
          <ImageBackground
            source={BackgroundIconButton}
            style={styles.buttonBackground}
            imageStyle={styles.buttonImage}
          >
            <Icon name='chevron-right' size={30} color='#001137' />
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );

    return (
      <View key={community.id} style={styles.cardWrapper}>
        <BlurCard
          backgroundImage={community.image}
          topSection={topSection}
          footerSection={footerSection}
          onPress={handlePress}
          style={styles.card}
        />
      </View>
    );
  };

  if (communities.length === 1) {
    return <View style={styles.container}>{renderCard(communities[0])}</View>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {communities.map(renderCard)}
    </ScrollView>
  );
};

export default JoinCommunityCard;
