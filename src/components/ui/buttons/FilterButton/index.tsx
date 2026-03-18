import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import SecondaryButton from '../Secondary';
import { ModalBase } from '@/components/ui/modals/shared';
import { COLORS } from '@/constants';

type Props = {
  label: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  /** Quando true, o botão é exibido em azul (estado selecionado). */
  selected?: boolean;
  modalTitle?: string;
  modalContent?: React.ReactNode;
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
  iconPosition = 'right',
  selected = false,
  modalTitle,
  modalContent,
  onPress,
  onModalClose,
  onModalOpen,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const hasModal = !!modalContent;

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

  return (
    <>
      <SecondaryButton
        label={label}
        onPress={handlePress}
        icon={icon}
        iconPosition={iconPosition}
        style={selected ? selectedButtonStyle.root : undefined}
        labelStyle={selected ? selectedButtonStyle.label : undefined}
        iconColor={selected ? COLORS.WHITE : undefined}
      />
      {hasModal && (
        <ModalBase visible={isModalVisible} onClose={handleClose} title={modalTitle}>
          {modalContent}
        </ModalBase>
      )}
    </>
  );
};

export default FilterButton;
