import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Background } from '@/components/ui/layout';
import { useTranslation } from '@/hooks/i18n';
import { PostCard } from '@/components/sections/community';
import type { Post } from '@/types';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CommunityPreviewScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CommunityPreview'>;
  route: {
    params: {
      productId: string;
      productName?: string;
    };
  };
};

const CommunityPreviewScreen: React.FC<CommunityPreviewScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { productId, productName } = route.params;

  // Mock data - será substituído por dados reais do backend
  const posts: Post[] = [
    {
      id: '1',
      userName: 'John Doe',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      content: 'This product has been amazing for my daily routine! Highly recommend it.',
      createdAt: new Date('2024-01-15'),
      reactionsCount: 12,
      commentsCount: 5,
      comments: [],
    },
    {
      id: '2',
      userName: 'Jane Smith',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      content: "I've been using this for a month now and I can see great improvements.",
      createdAt: new Date('2024-01-14'),
      reactionsCount: 8,
      commentsCount: 3,
      comments: [],
    },
    {
      id: '3',
      userName: 'Mike Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      content: 'Great quality and fast delivery. Will definitely order again!',
      createdAt: new Date('2024-01-13'),
      reactionsCount: 15,
      commentsCount: 7,
      comments: [],
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header showBackButton={true} onBackPress={handleBackPress} />
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>{t('marketplace.communityPreview')}</Text>
          {productName && <Text style={styles.screenSubtitle}>{productName}</Text>}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('marketplace.noCommunityPostsFound')}</Text>
            </View>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CommunityPreviewScreen;
