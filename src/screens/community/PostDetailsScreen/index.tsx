import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import PostDetailsHeader from '@/components/ui/PostDetailsHeader';
import CommentCard from '@/components/ui/CommentCard';
import FloatingMenu from '@/components/ui/FloatingMenu';
import { Post } from '@/components/ui/PostCard';
import commentsService, { Comment, PaginatedCommentsResponse } from '@/services/commentsService';
import { CommunityStackParamList } from '@/types';
import { styles } from './styles';

type PostDetailsRouteProp = RouteProp<CommunityStackParamList, 'PostDetails'>;
type PostDetailsNavigationProp = StackNavigationProp<CommunityStackParamList, 'PostDetails'>;

const PostDetailsScreen: React.FC = () => {
  const route = useRoute<PostDetailsRouteProp>();
  const navigation = useNavigation<PostDetailsNavigationProp>();
  const { post } = route.params;

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const PAGE_SIZE = 10;

  const loadComments = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const response: PaginatedCommentsResponse = await commentsService.getComments({
          postId: post.id,
          page,
          pageSize: PAGE_SIZE,
        });

        if (append) {
          setComments((prev) => [...prev, ...response.data]);
        } else {
          setComments(response.data);
        }

        setCurrentPage(page);
        setHasMore(response.pagination.hasMore);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar comentários';
        setError(errorMessage);
        console.error('Error loading comments:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [post.id]
  );

  useEffect(() => {
    loadComments(1);
  }, [loadComments]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      loadComments(currentPage + 1, true);
    }
  }, [currentPage, hasMore, loadingMore, loading, loadComments]);

  const handleUpvote = async (commentId: string) => {
    try {
      await commentsService.upvoteComment(commentId);
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, upvotes: comment.upvotes + 1 };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
                  ? { ...reply, upvotes: reply.upvotes + 1 }
                  : reply
              ),
            };
          }
          return comment;
        })
      );
    } catch (err) {
      console.error('Error upvoting comment:', err);
    }
  };

  const handleDownvote = async (commentId: string) => {
    try {
      await commentsService.downvoteComment(commentId);
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, downvotes: comment.downvotes + 1 };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
                  ? { ...reply, downvotes: reply.downvotes + 1 }
                  : reply
              ),
            };
          }
          return comment;
        })
      );
    } catch (err) {
      console.error('Error downvoting comment:', err);
    }
  };

  const handleReply = (comment: Comment) => {
    // Aqui você pode adicionar lógica para abrir modal de resposta
    console.log('Responder ao comentário:', comment.id);
  };

  const handleToggleReplies = (commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <CommentCard
      comment={item}
      onReply={handleReply}
      onUpvote={handleUpvote}
      onDownvote={handleDownvote}
      showReplies={expandedComments.has(item.id)}
      onToggleReplies={() => handleToggleReplies(item.id)}
    />
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
          {error || 'Nenhum comentário ainda. Seja o primeiro a comentar!'}
        </Text>
      </View>
    );
  };

  const renderHeader = () => (
    <>
      <PostDetailsHeader post={post} />
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>Comments</Text>
      </View>
    </>
  );

  const floatingMenuItems = [
    {
      id: 'create-post',
      icon: 'create',
      label: 'Criar Post',
      onPress: () => console.log('Criar post'),
    },
    {
      id: 'feed',
      icon: 'home',
      label: 'Feed Principal',
      onPress: () => navigation.navigate('CommunityList'),
    },
    {
      id: 'communities',
      icon: 'group',
      label: 'Comunidades',
      onPress: () => navigation.navigate('CommunityList'),
    },
    {
      id: 'messages',
      icon: 'message',
      label: 'Mensagens',
      onPress: () => console.log('Mensagens'),
    },
    {
      id: 'profile',
      icon: 'person',
      label: 'Perfil',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <>
            {renderFooter()}
            {hasMore && (
              <TouchableOpacity
                style={styles.seeAllButton}
                onPress={handleLoadMore}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            )}
          </>
        }
        ListEmptyComponent={renderEmpty}
      />
      <FloatingMenu items={floatingMenuItems} />
    </SafeAreaView>
  );
};

export default PostDetailsScreen;

