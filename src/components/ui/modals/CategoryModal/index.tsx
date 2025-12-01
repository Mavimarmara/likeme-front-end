import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { SPACING } from '@/constants';
import type { CommunityCategory } from '@/types/community';

const COLORS = {
  TEXT_DARK: '#001137',
  TEXT_LIGHT: '#666666',
  PRIMARY: '#0154f8',
};

// Mapeamento de categorias para ícones e cores (baseado no FilterModal)
const CATEGORY_MAP: Record<string, { icon: string; color: string }> = {
  stress: { icon: '💊', color: '#FF6B6B' },
  connection: { icon: '🤝', color: '#FFD93D' },
  smile: { icon: '😊', color: '#6BCF7F' },
  nutrition: { icon: '🥗', color: '#4ECDC4' },
  sleep: { icon: '😴', color: '#95A5A6' },
  spirituality: { icon: '🧘', color: '#E17055' },
  'self-esteem': { icon: '💪', color: '#F39C12' },
  'purpose-vision': { icon: '🎯', color: '#8B4513' },
  'purpose & vision': { icon: '🎯', color: '#8B4513' },
  environment: { icon: '🌱', color: '#27AE60' },
  activity: { icon: '🏃', color: '#3498DB' },
};

// Função para normalizar o nome da categoria e encontrar o mapeamento
const getCategoryInfo = (categoryName: string) => {
  const normalized = categoryName.toLowerCase().trim();
  // Tentar encontrar correspondência exata
  if (CATEGORY_MAP[normalized]) {
    return CATEGORY_MAP[normalized];
  }
  // Tentar encontrar correspondência parcial
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  // Retornar padrão se não encontrar
  return { icon: '📌', color: '#666666' };
};

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
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Icon name="close" size={24} color={COLORS.TEXT_DARK} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.optionsGrid}>
              {categories.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nenhuma categoria disponível</Text>
                </View>
              ) : (
                categories.map((category) => {
                  const isSelected = category.categoryId === selectedCategoryId;
                  const categoryInfo = getCategoryInfo(category.name);
                  return (
                    <TouchableOpacity
                      key={category.categoryId}
                      style={[
                        styles.filterOption,
                        isSelected && styles.filterOptionSelected,
                      ]}
                      onPress={() => handleCategoryPress(category)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.optionIcon}>{categoryInfo.icon}</Text>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryModal;

