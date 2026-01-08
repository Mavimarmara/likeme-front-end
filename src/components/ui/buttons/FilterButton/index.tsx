import React, { useState } from 'react';
import SecondaryButton from '../Secondary';
import { ModalBase } from '@/components/ui/modals/shared';

type Props = {
  label: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  modalTitle?: string;
  modalContent?: React.ReactNode;
  onPress?: () => void;
  onModalClose?: () => void;
  onModalOpen?: () => void;
};

const FilterButton: React.FC<Props> = ({
  label,
  icon = 'arrow-drop-down',
  iconPosition = 'right',
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
        size='small'
      />
      {hasModal && (
        <ModalBase
          visible={isModalVisible}
          onClose={handleClose}
          title={modalTitle}
        >
          {modalContent}
        </ModalBase>
      )}
    </>
  );
};

export default FilterButton;
