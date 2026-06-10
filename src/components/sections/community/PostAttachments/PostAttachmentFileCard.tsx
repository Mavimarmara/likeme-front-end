import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '@/hooks/i18n';
import type { PostAttachment } from '@/types';
import { downloadCommunityAttachment } from '@/utils/community/communityAttachmentDownload';
import { communityFileKindIconName } from '@/utils/community/communityFileKind';
import { communityFileKindVisual } from '@/utils/community/communityFileKindVisual';
import { attachmentStyles as styles } from './styles';

type Props = {
  attachment: PostAttachment;
  compact?: boolean;
};

const PostAttachmentFileCard: React.FC<Props> = ({ attachment, compact = false }) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const iconName = communityFileKindIconName(attachment.kind);
  const visual = communityFileKindVisual(attachment.kind);
  const extensionLabel = attachment.extension || attachment.fileName.split('.').pop()?.toUpperCase() || 'FILE';

  const onDownloadPress = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadCommunityAttachment(attachment);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fileCard,
        compact ? styles.fileCardCompact : undefined,
        pressed && !isDownloading ? { opacity: 0.9 } : undefined,
        isDownloading ? { opacity: 0.75 } : undefined,
      ]}
      onPress={(event) => {
        event?.stopPropagation?.();
        void onDownloadPress();
      }}
      disabled={isDownloading}
      accessibilityRole='button'
      accessibilityLabel={t('community.attachments.downloadFile', { fileName: attachment.fileName })}
      accessibilityState={{ busy: isDownloading }}
    >
      <View
        style={[
          styles.fileIconWrap,
          compact ? styles.fileIconWrapCompact : undefined,
          { backgroundColor: visual.iconBackground },
        ]}
      >
        <Icon name={iconName} size={compact ? 18 : 22} color={visual.iconColor} />
      </View>
      <View style={[styles.fileTextWrap, compact ? styles.fileTextWrapCompact : undefined]}>
        <Text style={[styles.fileName, compact ? styles.fileNameCompact : undefined]} numberOfLines={compact ? 2 : 1}>
          {attachment.fileName}
        </Text>
        <Text style={[styles.fileExtension, compact ? styles.fileExtensionCompact : undefined]}>
          {extensionLabel.replace(/^\./, '')}
        </Text>
      </View>
      {isDownloading ? (
        <ActivityIndicator size='small' color='#0154f8' style={styles.fileActionIcon} />
      ) : (
        <Icon name='file-download' size={20} color='#0154f8' style={styles.fileActionIcon} />
      )}
    </Pressable>
  );
};

export default PostAttachmentFileCard;
