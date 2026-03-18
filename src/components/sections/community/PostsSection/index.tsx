import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { EmptyState } from '@/components/ui';
import { PostCard } from '@/components/sections/community';
import { useTranslation } from '@/hooks/i18n';
import type { Post } from '@/types';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';

type Props = {
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  onLoadMore: () => void;
};

const PostsSection: React.FC<Props> = ({ posts, loading, loadingMore, error, onLoadMore }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const renderLoadingFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size='small' color='#4CAF50' />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{`Erro: ${error}`}</Text>
        </View>
      );
    }

    if (posts.length === 0) {
      return <EmptyState title={t('community.noPostsFound')} description={t('community.noPostsFoundDescription')} />;
    }

    return null;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Posts</Text>
    </View>
  );

  if (loading && posts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#4CAF50' />
        </View>
      </View>
    );
  }

  return (
    <View>
      {renderHeader()}
      <View style={styles.container}>
        {posts.length === 0 ? (
          renderEmpty()
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPress={(selectedPost) => {
                  navigation.navigate('PostDetail', { post: selectedPost });
                }}
              />
            ))}
            {renderLoadingFooter()}
          </>
        )}
      </View>
    </View>
  );
};

export default PostsSection;
