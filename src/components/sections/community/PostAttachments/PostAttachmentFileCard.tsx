import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { useTranslation } from '@/hooks/i18n';
import type { PostAttachment } from '@/types';
import { downloadCommunityAttachment } from '@/utils/community/communityAttachmentDownload';
import { communityFileKindIconSource } from '@/utils/community/communityFileKindIconSource';
import { attachmentStyles as styles } from './styles';

type Props = {
  attachment: PostAttachment;
};

const PostAttachmentFileCard: React.FC<Props> = ({ attachment }) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const iconSource = communityFileKindIconSource(attachment.kind);

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
        styles.fileDownloadButton,
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
      <View style={styles.fileDownloadLeading}>
        <CachedImage source={iconSource} style={styles.fileDownloadKindIcon} contentFit='contain' />
        <Text style={styles.fileDownloadName} numberOfLines={1}>
          {attachment.fileName}
        </Text>
      </View>

      <View style={styles.fileDownloadAction}>
        {isDownloading ? (
          <ActivityIndicator size='small' color='#001137' />
        ) : (
          <>
            <Text style={styles.fileDownloadActionLabel}>{t('community.attachments.download')}</Text>
            <Icon name='vertical-align-bottom' size={24} color='#001137' />
          </>
        )}
      </View>
    </Pressable>
  );
};

export default PostAttachmentFileCard;
