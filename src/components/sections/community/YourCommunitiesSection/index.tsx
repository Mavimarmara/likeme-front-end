import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import type { Post } from '@/types';

export interface YourCommunity {
  id: string;
  title: string;
  description: string;
  membersCount: number;
  newPostsCount: number;
  posts: Post[];
}

type Props = {
  community: YourCommunity;
  onCommunityPress?: (community: YourCommunity) => void;
  onPostPress?: (post: Post) => void;
};

const YourCommunitiesSection: React.FC<Props> = ({ community, onCommunityPress, onPostPress }) => {
  if (!community) {
    return null;
  }

  const getPostTitle = (post: Post): string => {
    if (post.title) return post.title;
    if (post.content) {
      return post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content;
    }
    return 'Post sem título';
  };

  const getPostContent = (post: Post): string => {
    if (post.content && post.content.length > 100) {
      return post.content.substring(0, 100) + '...';
    }
    return post.content || '';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your communities</Text>

      <TouchableOpacity
        style={styles.communityCard}
        activeOpacity={0.9}
        onPress={() => onCommunityPress?.(community)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.membersBadge}>
            <View style={styles.avatarGroup}>
              <View style={[styles.avatar, styles.avatarBlue]} />
              <View style={[styles.avatar, styles.avatarPink]} />
              <View style={[styles.avatar, styles.avatarGreen]}>
                <Text style={styles.avatarText}>+{community.membersCount}</Text>
              </View>
            </View>
          </View>

          {community.newPostsCount > 0 && (
            <View style={styles.newPostBadge}>
              <Text style={styles.newPostText}>{community.newPostsCount} New Post</Text>
            </View>
          )}
        </View>

        <View style={styles.communityContent}>
          <Text style={styles.communityTitle}>{community.title}</Text>
          <Text style={styles.communityDescription}>{community.description}</Text>

          <Text style={styles.postsSectionTitle}>Newest posts</Text>

          <ScrollView
            style={styles.postsScrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {community.posts.map((post, index) => (
              <TouchableOpacity
                key={post.id || `post-${index}`}
                style={styles.postCard}
                activeOpacity={0.8}
                onPress={() => onPostPress?.(post)}
              >
                <View style={styles.postHeader}>
                  {post.userAvatar ? (
                    <Image source={{ uri: post.userAvatar }} style={styles.postAvatar} />
                  ) : (
                    <View style={styles.postAvatarPlaceholder}>
                      <Icon name="person" size={12} color="#6e6a6a" />
                    </View>
                  )}
                  {post.userName && <Text style={styles.postAuthorName}>{post.userName}</Text>}
                </View>

                <Text style={styles.postTitle} numberOfLines={2}>
                  {getPostTitle(post)}
                </Text>

                {getPostContent(post) && (
                  <Text style={styles.postContent} numberOfLines={2}>
                    {getPostContent(post)}
                  </Text>
                )}

                <View style={styles.postFooter}>
                  <View style={styles.postAction}>
                    <Icon name="chat-bubble-outline" size={20} color="#0154f8" />
                    <Text style={styles.postActionText}>{post.commentsCount || 0}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default YourCommunitiesSection;
