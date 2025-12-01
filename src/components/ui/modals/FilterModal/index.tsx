import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput as RNTextInput } from 'react-native';
import { ModalBase, SelectButton, SubmitButton } from '../shared';
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
            <SelectButton
              key={option.id}
              label={option.label}
              icon={option.icon}
              isSelected={isSelected}
              onPress={() => onSelect(option.id)}
            />
          );
        })}
      </View>
    </View>
  );

  const isSaveDisabled =
    selectedPostTypes.length === 0 &&
    !selectedSortBy &&
    !selectedDate &&
    !selectedAuthor;

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      title="Filter"
      footer={
        <SubmitButton
          label="Save"
          onPress={handleSave}
          disabled={isSaveDisabled}
        />
      }
    >
      <ScrollView
        style={styles.scrollView}
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
    </ModalBase>
  );
};

export default FilterModal;

