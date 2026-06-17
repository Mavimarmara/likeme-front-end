import React from 'react';
import { Text, View } from 'react-native';
import PostCard from '@/components/sections/community/PostCard';
import { useTranslation } from '@/hooks/i18n';
import type { Post } from '@/types';
import { styles } from './styles';

type Props = {
  post: Post;
  onPostPress?: (post: Post) => void;
};

const FeaturedPostsSection: React.FC<Props> = ({ post, onPostPress }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('community.featuredPostsTitle')}</Text>
      <PostCard post={post} onPress={onPostPress} styles={styles.card} />
    </View>
  );
};

export default React.memo(FeaturedPostsSection);
