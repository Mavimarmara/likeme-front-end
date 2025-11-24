import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput as RNTextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { SPACING } from '@/constants';
import type { CommunityFeedFilters } from '@/types/community/filters';

const COLORS = {
  TEXT_DARK: '#001137',
  TEXT_LIGHT: '#666666',
};

export type FilterOption = {
  id: string;
  label: string;
  icon?: string;
  color?: string;
};

export type FilterType = CommunityFeedFilters;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (filters: CommunityFeedFilters) => void;
  selectedFilters?: CommunityFeedFilters;
};

const POST_TYPES: FilterOption[] = [
  { id: 'stress', label: 'Stress', icon: '💊', color: '#FF6B6B' },
  { id: 'connection', label: 'Connection', icon: '🤝', color: '#FFD93D' },
  { id: 'smile', label: 'Smile', icon: '😊', color: '#6BCF7F' },
  { id: 'nutrition', label: 'Nutrition', icon: '🥗', color: '#4ECDC4' },
  { id: 'sleep', label: 'Sleep', icon: '😴', color: '#95A5A6' },
  { id: 'spirituality', label: 'Spirituality', icon: '🧘', color: '#E17055' },
  { id: 'self-esteem', label: 'Self-esteem', icon: '💪', color: '#F39C12' },
  { id: 'purpose-vision', label: 'Purpose & Vision', icon: '🎯', color: '#8B4513' },
  { id: 'environment', label: 'Environment', icon: '🌱', color: '#27AE60' },
  { id: 'activity', label: 'Activity', icon: '🏃', color: '#3498DB' },
];

const SORT_OPTIONS: FilterOption[] = [
  { id: 'recent', label: 'Most Recent' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'popular', label: 'Most Popular' },
];

const DATE_OPTIONS: FilterOption[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
];

const FilterModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  selectedFilters = {},
}) => {
  const [selectedPostTypes, setSelectedPostTypes] = useState<string[]>(
    selectedFilters.postType || []
  );
  const [selectedSortBy, setSelectedSortBy] = useState<string>(
    selectedFilters.sortBy || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    selectedFilters.publicationDate || ''
  );
  const [selectedAuthor, setSelectedAuthor] = useState<string>(
    selectedFilters.author || ''
  );

  const handlePostTypeToggle = (id: string) => {
    setSelectedPostTypes((prev) =>
      prev.includes(id) ? prev.filter((type) => type !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave({
      postType: selectedPostTypes.length > 0 ? selectedPostTypes : undefined,
      publicationDate: selectedDate || undefined,
      sortBy: selectedSortBy || undefined,
      author: selectedAuthor || undefined,
    });
    onClose();
  };

  const renderSection = (
    title: string,
    options: FilterOption[],
    selected: string | string[],
    onSelect: (id: string) => void,
    multiSelect: boolean = false
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsGrid}>
        {options.map((option) => {
          const isSelected = multiSelect
            ? (selected as string[]).includes(option.id)
            : selected === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOption,
                isSelected && styles.filterOptionSelected,
              ]}
              onPress={() => onSelect(option.id)}
              activeOpacity={0.7}
            >
              {option.icon && (
                <Text style={styles.optionIcon}>{option.icon}</Text>
              )}
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

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
            <Text style={styles.title}>Filter</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Icon name="close" size={24} color={COLORS.TEXT_DARK} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {renderSection(
              'Tipo de post',
              POST_TYPES,
              selectedPostTypes,
              handlePostTypeToggle,
              true
            )}

            {renderSection(
              'Data de publicação',
              DATE_OPTIONS,
              selectedDate,
              setSelectedDate,
              false
            )}

            {renderSection(
              'Ordenação',
              SORT_OPTIONS,
              selectedSortBy,
              setSelectedSortBy,
              false
            )}

            {/* Autor */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Autor</Text>
              <RNTextInput
                style={styles.authorInput}
                placeholder="Digite o nome do autor"
                placeholderTextColor={COLORS.TEXT_LIGHT}
                value={selectedAuthor}
                onChangeText={setSelectedAuthor}
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (selectedPostTypes.length === 0 &&
                !selectedSortBy &&
                !selectedDate &&
                !selectedAuthor) &&
                styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            activeOpacity={0.7}
            disabled={
              selectedPostTypes.length === 0 &&
              !selectedSortBy &&
              !selectedDate &&
              !selectedAuthor
            }
          >
            <Text
              style={[
                styles.saveButtonText,
                (selectedPostTypes.length === 0 &&
                  !selectedSortBy &&
                  !selectedDate &&
                  !selectedAuthor) &&
                  styles.saveButtonTextDisabled,
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

