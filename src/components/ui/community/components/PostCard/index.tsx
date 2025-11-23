import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Badge, CommentCard } from '@/components/ui';
import { PollCard } from '@/components/ui/community';
import { styles } from './styles';
import { COLORS } from '@/constants';
import type { Post } from '@/types';

type Props = {
  post: Post;
  onPress?: (post: Post) => void;
  category?: string;
};

const PostCard: React.FC<Props> = ({ post, onPress, category }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

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

  // Usar tags para o badge - se não houver tags, não mostrar badge
  // Filtrar a string "Tags" se vier como valor literal
  const getFirstTag = (): string | null => {
    if (!post.tags) return null;
    
    if (Array.isArray(post.tags)) {
      const validTag = post.tags.find(tag => 
        tag && typeof tag === 'string' && tag.toLowerCase() !== 'tags'
      );
      return validTag || null;
    }
    
    if (typeof post.tags === 'string' && post.tags.toLowerCase() !== 'tags') {
      return post.tags;
    }
    
    return null;
  };
  
  const badgeLabel = getFirstTag();
  const title = getTitle();
  const content = getContent();
  // Usar commentsCount do post se disponível, senão usar o tamanho do array de comentários
  const commentsCount = post.commentsCount !== undefined 
    ? post.commentsCount 
    : (post.comments?.length || 0);

  const handleCommentsPress = () => {
    setIsCommentsOpen(!isCommentsOpen);
  };

  const handleSeeMorePress = () => {
    setIsContentExpanded(!isContentExpanded);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {badgeLabel && (
          <View style={styles.badgeContainer}>
            <Badge label={badgeLabel} />
          </View>
        )}

        <View>
          <View style={styles.authorSection}>
            {post.userAvatar ? (
              <Image
                source={{ uri: post.userAvatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={12} color={COLORS.TEXT_LIGHT} />
              </View>
            )}
            {post.userName && (
              <Text style={styles.authorName}>{capitalizeWords(post.userName)}</Text>
            )}
          </View>

          {title ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {title}
              </Text>
            </View>
          ) : null}

          {content ? (
            <Text style={styles.description} numberOfLines={isContentExpanded ? undefined : 3}>
              {content}
            </Text>
          ) : null}
        </View>
      </View>

      {post.poll && (
        <PollCard
          poll={post.poll}
          userAvatar={post.userAvatar}
          userName={post.userName}
          overline={post.overline}
        />
      )}

      <View style={styles.footer}>
        {content && (
          <TouchableOpacity 
            style={styles.seeMoreButton}
            onPress={handleSeeMorePress}
            activeOpacity={0.7}
          >
            <Text style={styles.seeMoreButtonText}>
              {isContentExpanded ? "See less" : "See more"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.commentsInfo}
          onPress={handleCommentsPress}
          activeOpacity={0.7}
        >
          <Icon
            name="chat-bubble-outline"
            size={24}
            color="#0154f8"
          />
          <Text style={styles.commentsCount}>{commentsCount}</Text>
        </TouchableOpacity>
      </View>

      {isCommentsOpen && post.comments && post.comments.length > 0 && (
        <View style={styles.commentsSection}>
          {post.comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={{
                id: comment.id,
                postId: post.id,
                author: {
                  id: comment.userId,
                  name: comment.userName || `User ${comment.userId.slice(0, 8)}`,
                  avatar: comment.userAvatar,
                },
                content: comment.content,
                upvotes: comment.reactions?.filter(r => r.type === 'like' || r.type === 'upvote' || r.type === '👍').length || 0,
                downvotes: comment.reactions?.filter(r => r.type === 'dislike' || r.type === 'downvote' || r.type === '👎').length || 0,
                reactionsCount: comment.reactionsCount,
                commentsCount: comment.commentsCount,
                createdAt: comment.createdAt instanceof Date 
                  ? comment.createdAt.toISOString() 
                  : new Date(comment.createdAt).toISOString(),
              }}
              showReplies={true}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default PostCard;

