import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SearchBar } from '@/components/ui';
import FilterModal, { type FilterType } from '@/components/ui/modals/FilterModal';
import { PostCard } from '@/components/sections/community';
import type { Post } from '@/types';
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
  onFilterSave?: (filters: FilterType) => void;
  selectedFilters?: FilterType;
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
  onFilterSave,
  selectedFilters,
}) => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const handleFilterPress = () => {
    setIsFilterModalVisible(true);
    onFilterPress?.();
  };

  const handleFilterClose = () => {
    setIsFilterModalVisible(false);
  };

  const handleFilterSave = (filters: FilterType) => {
    onFilterSave?.(filters);
    setIsFilterModalVisible(false);
  };
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
      <View style={styles.searchBarContainer}>
        <SearchBar
          placeholder="Search"
          value={searchQuery}
          onChangeText={onSearchChange}
          onSearchPress={onSearchPress}
          onFilterPress={handleFilterPress}
          showFilterButton={true}
        />
      </View>
    </>
  );

  if (loading && posts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </View>
    );
  }

  return (
    <View>
      {renderHeader()}
      <View style={styles.container}>
      {posts.length === 0 ? renderEmpty() : (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {renderLoadingFooter()}
        </>
      )}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={handleFilterClose}
        onSave={handleFilterSave}
        selectedFilters={selectedFilters}
      />
      </View>
    </View>
  );
};

export default PostsSection;

