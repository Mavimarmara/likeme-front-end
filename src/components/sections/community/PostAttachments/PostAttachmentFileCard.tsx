import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { PostAttachment } from '@/types';
import { communityFileKindIconName } from '@/utils/community/communityFileKind';
import { openCommunityAttachmentUrl } from './PostImageFullscreenModal';
import { attachmentStyles as styles } from './styles';

type Props = {
  attachment: PostAttachment;
};

const PostAttachmentFileCard: React.FC<Props> = ({ attachment }) => {
  const iconName = communityFileKindIconName(attachment.kind);
  const extensionLabel = attachment.extension || attachment.fileName.split('.').pop()?.toUpperCase() || 'FILE';

  return (
    <Pressable
      style={({ pressed }) => [styles.fileCard, pressed ? { opacity: 0.9 } : undefined]}
      onPress={(event) => {
        event?.stopPropagation?.();
        void openCommunityAttachmentUrl(attachment.url, {
          attachmentId: attachment.id,
          kind: attachment.kind,
        });
      }}
      accessibilityRole='button'
      accessibilityLabel={`Abrir arquivo ${attachment.fileName}`}
    >
      <View style={styles.fileIconWrap}>
        <Icon name={iconName} size={22} color='#001137' />
      </View>
      <View style={styles.fileTextWrap}>
        <Text style={styles.fileName} numberOfLines={1}>
          {attachment.fileName}
        </Text>
        <Text style={styles.fileExtension}>{extensionLabel.replace(/^\./, '')}</Text>
      </View>
      <Icon name='open-in-new' size={18} color='#0154f8' />
    </Pressable>
  );
};

export default PostAttachmentFileCard;
