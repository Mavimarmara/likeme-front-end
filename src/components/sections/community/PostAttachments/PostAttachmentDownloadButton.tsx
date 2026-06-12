import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '@/hooks/i18n';
import { COMMUNITY_ATTACHMENT_DOWNLOAD_MATERIAL_I18N_KEY } from '@/constants/community/communityAttachmentI18n';
import type { PostAttachment } from '@/types';
import { downloadCommunityAttachmentsSequentially } from '@/utils/community/communityAttachmentDownload';
import { attachmentStyles as styles } from './styles';

type Props = {
  attachments: PostAttachment[];
};

const PostAttachmentDownloadButton: React.FC<Props> = ({ attachments }) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  const onDownloadPress = async () => {
    if (isDownloading || attachments.length === 0) {
      return;
    }

    setIsDownloading(true);
    try {
      await downloadCommunityAttachmentsSequentially(attachments);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fileDownloadActionButton,
        pressed && !isDownloading ? { opacity: 0.9 } : undefined,
        isDownloading ? { opacity: 0.75 } : undefined,
      ]}
      onPress={(event) => {
        event?.stopPropagation?.();
        void onDownloadPress();
      }}
      disabled={isDownloading}
      accessibilityRole='button'
      accessibilityLabel={t(COMMUNITY_ATTACHMENT_DOWNLOAD_MATERIAL_I18N_KEY)}
      accessibilityState={{ busy: isDownloading }}
      testID='post-attachment-download-material'
    >
      {isDownloading ? (
        <ActivityIndicator size='small' color='#001137' />
      ) : (
        <>
          <Text style={styles.fileDownloadActionLabel}>{t(COMMUNITY_ATTACHMENT_DOWNLOAD_MATERIAL_I18N_KEY)}</Text>
          <Icon name='vertical-align-bottom' size={24} color='#001137' />
        </>
      )}
    </Pressable>
  );
};

export default PostAttachmentDownloadButton;
