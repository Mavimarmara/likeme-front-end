import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import type { CommunityCategory } from '@/types/community';

type Props = {
  visible: boolean;
  onClose: () => void;
  categories: CommunityCategory[];
  onSelectCategory?: (category: CommunityCategory) => void;
  selectedCategoryId?: string;
};

const CategoryModal: React.FC<Props> = ({
  visible,
  onClose,
  categories,
  onSelectCategory,
  selectedCategoryId,
}) => {
  const handleCategoryPress = (category: CommunityCategory) => {
    onSelectCategory?.(category);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Marcadores</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#001137" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {categories.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma categoria disponível</Text>
              </View>
            ) : (
              categories.map((category) => {
                const isSelected = category.categoryId === selectedCategoryId;
                return (
                  <TouchableOpacity
                    key={category.categoryId}
                    style={[
                      styles.categoryItem,
                      isSelected && styles.categoryItemSelected,
                    ]}
                    onPress={() => handleCategoryPress(category)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryName,
                        isSelected && styles.categoryNameSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                    {isSelected && (
                      <Icon name="check" size={20} color="#001137" />
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryModal;

