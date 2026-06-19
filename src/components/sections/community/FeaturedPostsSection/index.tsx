import React from 'react';
import { View } from 'react-native';
import PostCard from '@/components/sections/community/PostCard';
import type { Post } from '@/types';
import { styles } from './styles';

type SectionProps = {
  post: Post;
  onPostPress?: (post: Post) => void;
};

const FeaturedPostsSection: React.FC<SectionProps> = ({ post, onPostPress }) => {
  return (
    <View style={styles.section}>
      <PostCard post={post} onPress={onPostPress} isPinned />
    </View>
  );
};

export default React.memo(FeaturedPostsSection);
