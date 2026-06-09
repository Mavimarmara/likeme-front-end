import React from 'react';
import { Linking, Modal, Pressable, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { logger } from '@/utils/logger';
import { attachmentStyles as styles } from './styles';

type Props = {
  uri: string;
  visible: boolean;
  onClose: () => void;
};

const PostImageFullscreenModal: React.FC<Props> = ({ uri, visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <View style={styles.fullscreenBackdrop}>
        <Pressable
          style={styles.fullscreenClose}
          onPress={onClose}
          accessibilityRole='button'
          accessibilityLabel='Fechar imagem'
        >
          <Icon name='close' size={24} color='#ffffff' />
        </Pressable>
        <CachedImage
          source={{ uri }}
          style={styles.fullscreenImage}
          contentFit='contain'
          recyclingKey={`fullscreen-${uri}`}
        />
      </View>
    </Modal>
  );
};

export async function openCommunityAttachmentUrl(
  url: string,
  context: { attachmentId: string; kind: string },
): Promise<void> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      logger.warn('Não foi possível abrir anexo do post', { ...context, url });
      return;
    }
    await Linking.openURL(url);
  } catch (error) {
    logger.warn('Falha ao abrir anexo do post', { ...context, url, cause: error });
  }
}

export default PostImageFullscreenModal;
