import React from 'react';
import { Text, View } from 'react-native';
import PostCard from '@/components/sections/community/PostCard';
import { useTranslation } from '@/hooks/i18n';
import type { Post } from '@/types';
import { styles } from './styles';

type SectionProps = {
  post: Post;
  onPostPress?: (post: Post) => void;
};

const FeaturedPostsSection: React.FC<SectionProps> = ({ post, onPostPress }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('community.featuredPostsTitle')}</Text>
      <PostCard post={post} onPress={onPostPress} isPinned />
    </View>
  );
};

export default React.memo(FeaturedPostsSection);
