import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

export interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  author: {
    id: string;
    name: string;
    avatar?: string | ImageSourcePropType;
  };
  commentsCount: number;
  createdAt?: string;
}

type Props = {
  post: Post;
  onPress: (post: Post) => void;
};

const PostCard: React.FC<Props> = ({ post, onPress }) => {
  const isAvatarUri = post.author.avatar && typeof post.author.avatar === 'string';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(post)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryTag}>
        <Text style={styles.categoryText}>{post.category}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {post.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.authorInfo}>
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
              <Icon name="person" size={16} color="#666" />
            </View>
          )}
          <Text style={styles.authorName}>{post.author.name}</Text>
        </View>

        <View style={styles.commentsInfo}>
          <Icon name="chat-bubble-outline" size={18} color="#000" />
          <Text style={styles.commentsCount}>{post.commentsCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;

