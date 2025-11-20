import React from 'react';
import { View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import type { Post } from '@/types';

type Props = {
  post: Post;
};

const PostDetailsHeader: React.FC<Props> = ({ post }) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
    return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
  };

  const displayTitle = post.title || post.content?.split('\n')[0] || post.content || '';
  const displayDescription = post.title 
    ? post.content?.replace(post.title, '').trim() || ''
    : post.content?.split('\n').slice(1).join(' ').trim() || '';
  
  const commentsCount = post.comments?.length || 0;

  return (
    <View style={styles.container}>
      {post.category && (
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{post.category}</Text>
        </View>
      )}

      <View style={styles.authorSection}>
        {post.userAvatar ? (
          <Image
            source={{ uri: post.userAvatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={20} color="#666" />
          </View>
        )}
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.userName || `Usuário ${post.userId.slice(0, 8)}`}</Text>
          <Text style={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</Text>
        </View>
      </View>

      {displayTitle && (
        <Text style={styles.title}>{displayTitle}</Text>
      )}

      {displayDescription && (
        <Text style={styles.description}>{displayDescription}</Text>
      )}

      <View style={styles.commentsInfo}>
        <Icon name="chat-bubble-outline" size={20} color="#000" />
        <Text style={styles.commentsCount}>{commentsCount} comentários</Text>
      </View>
    </View>
  );
};

export default PostDetailsHeader;

