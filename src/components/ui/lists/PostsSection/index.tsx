import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput, PostCard, Post } from '@/components/ui';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

type Props = {
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;
  onPostPress: (post: Post) => void;
  onSearchChange: (text: string) => void;
  onLoadMore: () => void;
  onFilterPress?: () => void;
};

const PostsSection: React.FC<Props> = ({
  posts,
  loading,
  loadingMore,
  error,
  searchQuery,
  onPostPress,
  onSearchChange,
  onLoadMore,
  onFilterPress,
}) => {

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard post={item} onPress={onPostPress} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {error || 'Nenhum post encontrado'}
        </Text>
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
        <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
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

  return (
    <View style={styles.container}>
      {loading && posts.length === 0 ? (
        <>
          {renderHeader()}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        </>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
};

export default PostsSection;

