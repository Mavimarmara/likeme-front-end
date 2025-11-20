import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { COLORS } from '@/constants';
import { dateUtils } from '@/utils';
import type { Post } from '@/types';

type Props = {
  post: Post;
  onPress?: (post: Post) => void;
};

const PostCard: React.FC<Props> = ({ post, onPress }) => {
  const formatDate = (date: Date): string => {
    if (dateUtils.isToday(date)) {
      return 'Hoje';
    }
    if (dateUtils.isYesterday(date)) {
      return 'Ontem';
    }
    return dateUtils.formatDate(date);
  };

  const formatLikes = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handlePress = () => {
    onPress?.(post);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Icon name="person" size={20} color={COLORS.TEXT_LIGHT} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>Usuário {post.userId.slice(0, 8)}</Text>
          <Text style={styles.dateText}>{formatDate(post.createdAt)}</Text>
        </View>
      </View>

      {post.content ? (
        <Text style={styles.content} numberOfLines={4}>
          {post.content}
        </Text>
      ) : null}

      {post.image ? (
        <Image
          source={{ uri: post.image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Icon
            name="favorite-border"
            size={20}
            color={COLORS.TEXT_LIGHT}
          />
          <Text style={styles.actionText}>{formatLikes(post.likes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Icon
            name="chat-bubble-outline"
            size={20}
            color={COLORS.TEXT_LIGHT}
          />
          <Text style={styles.actionText}>
            {post.comments.length > 0 ? post.comments.length : '0'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Icon name="share" size={20} color={COLORS.TEXT_LIGHT} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;

