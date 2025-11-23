import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput } from '@/components/ui';
import { PostCard } from '@/components/ui/community';
import type { Post } from '@/types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { logger } from '@/utils/logger';
import { styles } from './styles';

type Props = {
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchPress?: () => void;
  onLoadMore: () => void;
  onFilterPress?: () => void;
};

const PostsSection: React.FC<Props> = ({
  posts,
  loading,
  loadingMore,
  error,
  searchQuery,
  onSearchChange,
  onSearchPress,
  onLoadMore,
  onFilterPress,
}) => {
  useEffect(() => {
    logger.debug('PostsSection - Posts received:', {
      postsCount: posts.length,
      loading,
      loadingMore,
      error,
      firstPost: posts[0] ? {
        id: posts[0].id,
        userId: posts[0].userId,
        contentLength: posts[0].content?.length || 0,
        hasImage: !!posts[0].image,
      } : null,
    });
  }, [posts, loading, loadingMore, error]);

  const renderLoadingFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    
    const emptyMessage = error 
      ? `Erro: ${error}` 
      : posts.length === 0 
        ? 'Nenhum post encontrado' 
        : null;
    
    if (!emptyMessage) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Posts</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChangeText={onSearchChange}
            containerStyle={styles.searchInputContainer}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity 
          style={styles.searchButton} 
          activeOpacity={0.7}
          onPress={onSearchPress}
        >
          <Icon name="search" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.7}
          onPress={onFilterPress}
        >
          <Icon name="filter-list" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </>
  );

  if (loading && posts.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {posts.length === 0 ? renderEmpty() : (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {renderLoadingFooter()}
        </>
      )}
    </View>
  );
};

export default PostsSection;

