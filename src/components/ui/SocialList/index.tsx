import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import LiveBanner, { LiveBannerData } from '../LiveBanner';
import { styles } from './styles';

export interface Community {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  image?: string;
}

type Props = {
  communities: Community[];
  onCommunityPress: (community: Community) => void;
  selectedCommunityId?: string;
  liveBanner?: LiveBannerData | null;
  onLivePress?: (live: LiveBannerData) => void;
};

const SocialList: React.FC<Props> = ({
  communities,
  onCommunityPress,
  selectedCommunityId,
  liveBanner,
  onLivePress,
}) => {
  const renderCommunity = ({ item }: { item: Community }) => {
    const isSelected = item.id === selectedCommunityId;

    return (
      <TouchableOpacity
        style={[styles.communityCard, isSelected && styles.communityCardSelected]}
        onPress={() => onCommunityPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.communityContent}>
          <Text style={styles.communityName}>{item.name}</Text>
          <Text style={styles.communityDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.communityMembers}>
            {item.membersCount} membros
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLiveBanner = () => {
    if (!liveBanner || !onLivePress) return null;
    return (
      <View style={styles.liveBannerContainer}>
        <LiveBanner live={liveBanner} onPress={onLivePress} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={communities}
        renderItem={renderCommunity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderLiveBanner()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma comunidade encontrada</Text>
          </View>
        }
      />
    </View>
  );
};

export default SocialList;

