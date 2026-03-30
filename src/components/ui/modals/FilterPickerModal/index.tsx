import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FilterModalButton, PrimaryButton } from '@/components/ui/buttons';
import type { ButtonCarouselOption } from '@/components/ui/carousel';
import { styles } from './styles';

export type FilterPickerSection<T extends string | number = string> = {
  /** Título acima do grid; omitir ou vazio quando o `ModalBase` já exibe o assunto (ex.: ordenação). */
  sectionTitle?: string;
  options: ButtonCarouselOption<T>[];
};

export type FilterPickerOptionPressContext = {
  sectionIndex: number;
};

function resolveDraft<T extends string | number>(
  sections: FilterPickerSection<T>[],
  selectedId: T | null | undefined,
): { id: T | null; sectionIndex: number } {
  if (sections.length === 0) {
    return { id: null, sectionIndex: 0 };
  }
  if (selectedId != null && selectedId !== '') {
    for (let si = 0; si < sections.length; si++) {
      const hit = sections[si].options.some((o) => String(o.id) === String(selectedId));
      if (hit) {
        return { id: selectedId, sectionIndex: si };
      }
    }
  }
  const first = sections[0].options[0];
  return { id: first != null ? first.id : null, sectionIndex: 0 };
}

type Props<T extends string | number = string> = {
  visible: boolean;
  sections: FilterPickerSection<T>[];
  selectedId?: T | null;
  confirmLabel: string;
  onConfirm: (optionId: T, context: FilterPickerOptionPressContext) => void;
};

export function FilterPickerModal<T extends string | number = string>({
  visible,
  sections,
  selectedId,
  confirmLabel,
  onConfirm,
}: Props<T>) {
  const [draftId, setDraftId] = useState<T | null>(() => resolveDraft(sections, selectedId).id);
  const [draftSectionIndex, setDraftSectionIndex] = useState(() => resolveDraft(sections, selectedId).sectionIndex);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const d = resolveDraft(sections, selectedId);
    setDraftId(d.id);
    setDraftSectionIndex(d.sectionIndex);
  }, [visible, selectedId, sections]);

  const lastSectionIndex = sections.length - 1;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {sections.map((section, sectionIndex) => {
          const showTitle = section.sectionTitle != null && section.sectionTitle.trim().length > 0;
          const isLastSection = sectionIndex === lastSectionIndex;
          return (
            <View
              key={`section-${sectionIndex}`}
              style={[styles.sectionBlock, isLastSection && styles.sectionBlockLast]}
            >
              {showTitle ? <Text style={styles.sectionTitle}>{section.sectionTitle}</Text> : null}
              <View style={styles.optionsGrid}>
                {section.options.map((opt) => {
                  const isSelected = draftId != null && String(opt.id) === String(draftId);
                  return (
                    <FilterModalButton
                      key={`${sectionIndex}-${String(opt.id)}`}
                      label={opt.label}
                      selected={isSelected}
                      onPress={() => {
                        setDraftId(opt.id);
                        setDraftSectionIndex(sectionIndex);
                      }}
                      style={styles.chipWidth}
                    />
                  );
                })}
              </View>
              {!isLastSection ? <View style={styles.divider} /> : null}
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label={confirmLabel}
          size='medium'
          disabled={draftId == null}
          onPress={() => {
            if (draftId != null) {
              onConfirm(draftId, { sectionIndex: draftSectionIndex });
            }
          }}
        />
      </View>
    </View>
  );
}
