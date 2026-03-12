import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '@/hooks/i18n';
import { IconSilhouette } from '@/components/ui/layout';
import { FilterModalButton, PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { getMarkerColor, getMarkerGradient, hasMarkerGradient, MARKER_NAMES } from '@/constants/markers';
import { getMarkerIdForCategory } from '@/hooks/category';
import { styles } from './styles';
import type { CommunityCategory } from '@/types/community';

/** Lista fixa de categorias (markers) para exibir quando a API não retorna categorias */
const FALLBACK_CATEGORIES: CommunityCategory[] = (Object.entries(MARKER_NAMES) as [string, string][]).map(
  ([id, name]) => ({
    categoryId: id,
    name,
  }),
);

export type SolutionId = 'products' | 'services' | 'professionals' | 'programs' | 'communities';

export interface SolutionOption {
  id: SolutionId;
  labelKey: string;
}

const DEFAULT_SOLUTION_OPTIONS: SolutionOption[] = [
  { id: 'products', labelKey: 'filterCategory.solutions.products' },
  { id: 'services', labelKey: 'filterCategory.solutions.services' },
  { id: 'professionals', labelKey: 'filterCategory.solutions.professionals' },
  { id: 'programs', labelKey: 'filterCategory.solutions.programs' },
  { id: 'communities', labelKey: 'filterCategory.solutions.communities' },
];

export type FilterCategoryResult = {
  categoryId: string | null;
  solutionIds: SolutionId[];
};

type Props = {
  visible: boolean;
  onClose: () => void;
  categories: CommunityCategory[];
  selectedCategoryId: string | undefined;
  onSelectCategory: (category: CommunityCategory | null) => void;
  selectedSolutionIds: SolutionId[];
  onToggleSolution: (id: SolutionId) => void;
  onFilter: (result: FilterCategoryResult) => void;
  onClear: () => void;
};

const FilterCategoryModal: React.FC<Props> = ({
  visible,
  onClose,
  categories,
  selectedCategoryId,
  onSelectCategory,
  selectedSolutionIds,
  onToggleSolution,
  onFilter,
  onClear,
}) => {
  const { t } = useTranslation();
  const displayCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  /** Estado local da categoria selecionada para atualização imediata da UI ao toque */
  const [localSelectedCategoryId, setLocalSelectedCategoryId] = useState<string | undefined>(selectedCategoryId);
  const prevVisible = useRef(false);

  /** Sincroniza com o pai apenas quando o modal abre; evita sobrescrever a seleção durante o uso */
  useEffect(() => {
    if (visible && !prevVisible.current) {
      setLocalSelectedCategoryId(selectedCategoryId);
      prevVisible.current = true;
    }
    if (!visible) {
      prevVisible.current = false;
    }
  }, [visible, selectedCategoryId]);

  const handleSelectCategory = (cat: CommunityCategory | null) => {
    const nextId = cat ? String(cat.categoryId) : undefined;
    setLocalSelectedCategoryId(nextId);
    onSelectCategory(cat);
  };

  const handleFilter = () => {
    onFilter({
      categoryId: localSelectedCategoryId ?? null,
      solutionIds: [...selectedSolutionIds],
    });
    onClose();
  };

  const handleClear = () => {
    setLocalSelectedCategoryId(undefined);
    onClear();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <Icon name='close' size={24} color='#001137' />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '100%' }}>
            <Text style={styles.instructionText}>{t('filterCategory.instruction')}</Text>

            <Text style={styles.sectionTitle}>{t('filterCategory.categoriesTitle')}</Text>
            <View style={styles.categoriesGrid}>
              {displayCategories.map((cat) => {
                const isSelected =
                  localSelectedCategoryId != null && String(cat.categoryId) === String(localSelectedCategoryId);
                const markerId = getMarkerIdForCategory(cat.categoryId, cat.name);
                const tintColor =
                  markerId && hasMarkerGradient(markerId)
                    ? getMarkerGradient(markerId)
                    : markerId
                    ? getMarkerColor(markerId)
                    : '#001137';
                const categoryLabel = markerId
                  ? t(`filterCategory.categories.${markerId.replace(/-/g, '_')}`)
                  : cat.name;
                return (
                  <FilterModalButton
                    key={cat.categoryId}
                    label={categoryLabel}
                    selected={isSelected}
                    onPress={() => handleSelectCategory(isSelected ? null : cat)}
                    icon={
                      <View style={styles.categoryIconSmall}>
                        <IconSilhouette tintColor={tintColor} size='xsmall' />
                      </View>
                    }
                    style={styles.chipWidth}
                  />
                );
              })}
            </View>
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>{t('filterCategory.solutionsTitle')}</Text>
            <View style={styles.solutionsGrid}>
              {DEFAULT_SOLUTION_OPTIONS.map((opt) => {
                const isSelected = selectedSolutionIds.includes(opt.id);
                return (
                  <FilterModalButton
                    key={opt.id}
                    label={t(opt.labelKey)}
                    selected={isSelected}
                    onPress={() => onToggleSolution(opt.id)}
                    style={styles.chipWidth}
                  />
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footerButtons}>
            <PrimaryButton label={t('filterCategory.filter')} size='medium' onPress={handleFilter} />
            <SecondaryButton label={t('filterCategory.clearFilters')} size='medium' onPress={handleClear} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterCategoryModal;
