import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Badge, SecondaryButton } from '@/components/ui';
import { styles } from './styles';
import { COLORS } from '@/constants';
import type { Post } from '@/types';

type Props = {
  post: Post;
  onPress?: (post: Post) => void;
  category?: string;
};

const PostCard: React.FC<Props> = ({ post, onPress, category }) => {
  const capitalizeWords = (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getTitle = (): string => {
    if (post.title) return post.title;
    if (!post.content) return '';
    
    const lines = post.content.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length > 30 && firstLine.length < 150) {
        return firstLine;
      }
    }
    
    const sentences = post.content.split(/[.!?]/).filter(s => s.trim());
    if (sentences.length > 0) {
      const firstSentence = sentences[0].trim();
      if (firstSentence.length > 30 && firstSentence.length < 150) {
        return firstSentence;
      }
    }
    
    const truncated = post.content.substring(0, 120).trim();
    if (truncated.length >= 30) {
      return truncated;
    }
    
    return post.content.substring(0, 100);
  };

  const getContent = (): string => {
    if (!post.content) return '';
    
    const title = getTitle();
    let remaining = post.content;
    
    if (post.title && post.content.startsWith(post.title)) {
      remaining = post.content.substring(post.title.length).trim();
    } else if (post.content.startsWith(title)) {
      remaining = post.content.substring(title.length).trim();
    }
    
    if (remaining.length > 0) {
      return remaining;
    }
    
    return '';
  };

  const displayCategory = category || post.category;
  const title = getTitle();
  const content = getContent();
  const commentsCount = post.comments.length > 0 ? post.comments.length : 0;

  const handlePress = () => {
    onPress?.(post);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      {displayCategory && <Badge label={displayCategory} />}

      <View style={styles.authorSection}>
        {post.userAvatar ? (
          <Image
            source={{ uri: post.userAvatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={20} color={COLORS.TEXT_LIGHT} />
          </View>
        )}
        {post.userName && (
          <Text style={styles.authorName}>{capitalizeWords(post.userName)}</Text>
        )}
      </View>

      {title ? (
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
      ) : null}

      {content ? (
        <Text style={styles.description} numberOfLines={3}>
          {content}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <SecondaryButton 
          label="See more"
          onPress={handlePress}
        />

        <View style={styles.commentsInfo}>
          <Icon
            name="chat-bubble-outline"
            size={18}
            color="#1565C0"
          />
          <Text style={styles.commentsCount}>{commentsCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;

