import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackgroundIconButton } from '@/assets';
import { SearchBar } from '@/components/ui';
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

type Props = {
  communities: OtherCommunity[];
  onCommunityPress?: (community: OtherCommunity) => void;
  onSearchChange?: (text: string) => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  searchQuery?: string;
};

export interface OtherCommunity {
  id: string;
  title: string;
  badge: string;
  image: string;
  rating: number;
  price: string;
}

const OtherCommunitiesSection: React.FC<Props> = ({
  communities,
  onCommunityPress,
  onSearchChange,
  onSearchPress,
  onFilterPress,
  searchQuery = '',
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState(searchQuery);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearchChange?.(text);
  };

  if (!communities || communities.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.otherCommunities')}</Text>
      <SearchBar
        placeholder={t('common.search')}
        value={searchText}
        onChangeText={handleSearchChange}
        onSearchPress={onSearchPress}
        onFilterPress={onFilterPress}
        showFilterButton={true}
      />
      <ScrollView
        style={styles.communitiesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.communitiesListContent}
      >
        {communities.map((community) => (
          <TouchableOpacity
            key={community.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => onCommunityPress?.(community)}
          >
            <Image source={{ uri: community.image }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{community.badge}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{community.rating}</Text>
                  <Icon name="star" size={18} color="#001137" />
                </View>
              </View>
              <View style={styles.cardBottom}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {community.title}
                  </Text>
                  <Text style={styles.cardPrice}>{community.price}</Text>
                </View>
                <TouchableOpacity
                  style={styles.actionButton}
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
      </ScrollView>
    </View>
  );
};

export default OtherCommunitiesSection;
