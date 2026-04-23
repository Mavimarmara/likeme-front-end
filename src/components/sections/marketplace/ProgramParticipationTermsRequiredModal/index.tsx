import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

type ProgramParticipationTermsRequiredModalProps = {
  visible: boolean;
  title: string;
  body: string;
  ctaLabel: string;
  onClose: () => void;
  onPressViewTerms: () => void;
};

export function ProgramParticipationTermsRequiredModal({
  visible,
  title,
  body,
  ctaLabel,
  onClose,
  onPressViewTerms,
}: ProgramParticipationTermsRequiredModalProps) {
  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} accessibilityRole='button' accessibilityLabel='Fechar'>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.closeHit} onPress={onClose} activeOpacity={0.7} accessibilityRole='button'>
              <Icon name='close' size={24} color='#001137' />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <TouchableOpacity style={styles.cta} onPress={onPressViewTerms} activeOpacity={0.85}>
            <Text style={styles.ctaLabel}>{ctaLabel}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
