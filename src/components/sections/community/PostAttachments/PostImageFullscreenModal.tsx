import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { useTranslation } from '@/hooks/i18n';
import { attachmentStyles as styles } from './styles';

type Props = {
  uris: string[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
};

const PostImageFullscreenModal: React.FC<Props> = ({ uris, initialIndex, visible, onClose }) => {
  const { t } = useTranslation();
  const [index, setIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    if (visible) {
      setIndex(initialIndex);
    }
  }, [initialIndex, visible]);

  const uri = uris[index] ?? '';
  const hasMultiple = uris.length > 1;
  const canGoPrevious = index > 0;
  const canGoNext = index < uris.length - 1;

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <View style={styles.fullscreenBackdrop}>
        <Pressable
          style={styles.fullscreenClose}
          onPress={onClose}
          accessibilityRole='button'
          accessibilityLabel={t('community.attachments.closeImage')}
        >
          <Icon name='close' size={24} color='#ffffff' />
        </Pressable>

        {hasMultiple && canGoPrevious ? (
          <Pressable
            style={[styles.fullscreenNav, styles.fullscreenNavPrevious]}
            onPress={() => setIndex((current) => Math.max(0, current - 1))}
            accessibilityRole='button'
            accessibilityLabel={t('community.attachments.previousImage')}
          >
            <Icon name='chevron-left' size={28} color='#ffffff' />
          </Pressable>
        ) : null}

        {hasMultiple && canGoNext ? (
          <Pressable
            style={[styles.fullscreenNav, styles.fullscreenNavNext]}
            onPress={() => setIndex((current) => Math.min(uris.length - 1, current + 1))}
            accessibilityRole='button'
            accessibilityLabel={t('community.attachments.nextImage')}
          >
            <Icon name='chevron-right' size={28} color='#ffffff' />
          </Pressable>
        ) : null}

        <CachedImage
          source={{ uri }}
          style={styles.fullscreenImage}
          contentFit='contain'
          recyclingKey={`fullscreen-${uri}`}
        />

        {hasMultiple ? (
          <Text style={styles.fullscreenCounter}>
            {index + 1}/{uris.length}
          </Text>
        ) : null}
      </View>
    </Modal>
  );
};

export default PostImageFullscreenModal;
