import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MarkdownText } from '@/components/ui/text/MarkdownText';
import { COLORS } from '@/constants';
import { styles } from './styles';

export type ModuleItem = {
  id: string;
  title: string;
  completed?: boolean;
  body?: string | null;
};

type Props = {
  modules: ModuleItem[];
  onModulePress?: (module: ModuleItem) => void;
};

const ModuleAccordion: React.FC<Props> = ({ modules, onModulePress }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (module: ModuleItem) => {
    if (expandedId === module.id) {
      setExpandedId(null);
    } else {
      setExpandedId(module.id);
      onModulePress?.(module);
    }
  };

  return (
    <View style={styles.container}>
      {modules.map((module) => {
        const isExpanded = expandedId === module.id;

        return (
          <View key={module.id} style={styles.moduleItem}>
            <TouchableOpacity style={styles.moduleHeader} onPress={() => toggleExpand(module)} activeOpacity={0.7}>
              <View style={styles.headerLeft}>
                <View style={[styles.checkCircle, module.completed && styles.checkCircleCompleted]}>
                  {module.completed && <Icon name='check' size={16} color={COLORS.WHITE} />}
                </View>
                <Text style={styles.moduleTitle}>{module.title}</Text>
              </View>
              <Icon
                name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={28}
                color={COLORS.NEUTRAL.LOW.PURE}
              />
            </TouchableOpacity>
            {isExpanded && module.body?.trim() ? (
              <View style={styles.moduleBody}>
                <MarkdownText style={styles.moduleBodyText} text={module.body.trim()} />
              </View>
            ) : null}
            <View style={styles.separator} />
          </View>
        );
      })}
    </View>
  );
};

export default ModuleAccordion;
