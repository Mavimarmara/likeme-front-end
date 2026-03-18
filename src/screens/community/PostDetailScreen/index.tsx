import React, { useMemo, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GradientBackground, ScreenWithHeader } from '@/components/ui/layout';
import { Badge } from '@/components/ui';
import { PostCard, PostReplies } from '@/components/sections/community';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import { COLORS, SPACING } from '@/constants';
import type { Post } from '@/types';

type Props = {
  navigation: any;
  route: {
    params: CommunityStackParamList['PostDetail'];
  };
};

const PostDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { post } = route.params;
  const [isCommentsOpen] = useState(true);

  const badgeLabel = useMemo((): string | null => {
    if (!post.tags) return null;

    if (Array.isArray(post.tags)) {
      const validTag = post.tags.find((tag) => tag && typeof tag === 'string' && tag.toLowerCase() !== 'tags');
      return validTag ?? null;
    }

    if (typeof post.tags === 'string' && post.tags.toLowerCase() !== 'tags') {
      return post.tags;
    }

    return null;
  }, [post.tags]);

  const title = useMemo(() => {
    const p: Post = post;
    if (p.title) return p.title;

    const lines = p.content.split('\n').filter((line) => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length > 30 && firstLine.length < 150) return firstLine;
    }

    return p.content.substring(0, 120).trim();
  }, [post]);

  const capitalizeWords = (text: string): string =>
    text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const authorName = post.userName ? capitalizeWords(post.userName) : '';

  return (
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{
        showBackButton: true,
        onBackPress: () => navigation?.goBack?.(),
      }}
      contentContainerStyle={{ flex: 1 }}
      contentBackgroundColor={COLORS.BACKGROUND_SECONDARY}
    >
      <View pointerEvents='none' style={styles.gradientBackground}>
        <GradientBackground />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ padding: SPACING.MD, paddingBottom: SPACING.XL }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {badgeLabel && (
            <View style={{ marginBottom: SPACING.XS }}>
              <Badge label={badgeLabel} />
            </View>
          )}

          <View style={styles.headerRow}>
            {post.userAvatar ? (
              <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name='person' size={16} color={COLORS.TEXT_LIGHT} />
              </View>
            )}
            {!!authorName && <Text style={styles.authorName}>{authorName}</Text>}
          </View>

          {!!post.overline && <Text style={styles.overline}>{post.overline}</Text>}
          {!!title && <Text style={styles.title}>{title}</Text>}
        </View>

        <PostCard post={post} initialCommentsOpen={isCommentsOpen} forceContentExpanded />

        {!post.poll && isCommentsOpen && <PostReplies postId={post.id} comments={post.comments} />}
      </ScrollView>
    </ScreenWithHeader>
  );
};

export default PostDetailScreen;
