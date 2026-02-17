import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

const COLORS = {
  TEXT_DARK: '#001137',
};

type ModalBaseProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  showTitle?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
};

export const ModalBase: React.FC<ModalBaseProps> = ({
  visible,
  onClose,
  title,
  showTitle = true,
  children,
  footer,
  header,
}) => {
  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {header ? (
            header
          ) : (
            <View style={styles.header}>
              {showTitle && title ? <Text style={styles.title}>{title}</Text> : <View style={styles.headerSpacer} />}
              <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                <Icon name='close' size={24} color={COLORS.TEXT_DARK} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.content}>{children}</View>

          {footer}
        </View>
      </View>
    </Modal>
  );
};
