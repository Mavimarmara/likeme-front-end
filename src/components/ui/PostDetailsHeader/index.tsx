import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { Post } from '../PostCard';

type Props = {
  post: Post;
};

const PostDetailsHeader: React.FC<Props> = ({ post }) => {
  const isAvatarUri = post.author.avatar && typeof post.author.avatar === 'string';

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'há pouco tempo';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
    return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoryTag}>
        <Text style={styles.categoryText}>{post.category}</Text>
      </View>

      <View style={styles.authorSection}>
        {post.author.avatar ? (
          isAvatarUri ? (
            <Image
              source={{ uri: post.author.avatar as string }}
              style={styles.avatar}
            />
          ) : (
            <Image source={post.author.avatar as ImageSourcePropType} style={styles.avatar} />
          )
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={20} color="#666" />
          </View>
        )}
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author.name}</Text>
          <Text style={styles.timeAgo}>{formatTimeAgo(post.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.description}>{post.description}</Text>

      <View style={styles.commentsInfo}>
        <Icon name="chat-bubble-outline" size={20} color="#000" />
        <Text style={styles.commentsCount}>{post.commentsCount} comentários</Text>
      </View>
    </View>
  );
};

export default PostDetailsHeader;

