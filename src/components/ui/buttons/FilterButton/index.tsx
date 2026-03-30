import React, { useState } from 'react';
import { StyleSheet, type ImageSourcePropType, type ImageStyle } from 'react-native';
import SecondaryButton from '../Secondary';
import { ModalBase } from '@/components/ui/modals/shared';
import { COLORS } from '@/constants';

type ModalContentRender = (api: { close: () => void }) => React.ReactNode;

type Props = {
  label: string;
  icon?: string;
  iconImage?: ImageSourcePropType;
  iconImageStyle?: ImageStyle;
  iconPosition?: 'left' | 'right';
  /** Quando true, o botão é exibido em azul (estado selecionado). */
  selected?: boolean;
  modalTitle?: string;
  modalContent?: React.ReactNode | ModalContentRender;
  onPress?: () => void;
  onModalClose?: () => void;
  onModalOpen?: () => void;
};

const selectedButtonStyle = StyleSheet.create({
  root: {
    backgroundColor: COLORS.PRIMARY.PURE,
    borderColor: COLORS.PRIMARY.PURE,
  },
  label: {
    color: COLORS.WHITE,
  },
});

const FilterButton: React.FC<Props> = ({
  label,
  icon = 'arrow-drop-down',
  iconImage,
  iconImageStyle,
  iconPosition = 'right',
  selected = false,
  modalTitle,
  modalContent,
  onPress,
  onModalClose,
  onModalOpen,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const hasModal = modalContent != null;

  const handlePress = () => {
    if (hasModal) {
      setIsModalVisible(true);
      onModalOpen?.();
    } else {
      onPress?.();
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
    onModalClose?.();
  };

  const resolvedModalContent = typeof modalContent === 'function' ? modalContent({ close: handleClose }) : modalContent;

  return (
    <>
      <SecondaryButton
        label={label}
        onPress={handlePress}
        icon={iconImage != null ? undefined : icon}
        iconImage={iconImage}
        iconImageStyle={iconImageStyle}
        iconPosition={iconPosition}
        style={selected ? selectedButtonStyle.root : undefined}
        labelStyle={selected ? selectedButtonStyle.label : undefined}
        iconColor={selected ? COLORS.WHITE : undefined}
      />
      {hasModal && (
        <ModalBase visible={isModalVisible} onClose={handleClose} title={modalTitle}>
          {resolvedModalContent}
        </ModalBase>
      )}
    </>
  );
};

export default FilterButton;
