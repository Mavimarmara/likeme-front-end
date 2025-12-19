import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import type { ProgramModule } from '@/types/program';
import VideoContent from '../VideoContent';
import ActivityContent from '../ActivityContent';

type Props = {
  module: ProgramModule;
  onToggle: (moduleId: string) => void;
};

const ModuleAccordion: React.FC<Props> = ({ module, onToggle }) => {
  const isExpanded = module.isExpanded || false;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, isExpanded && styles.headerExpanded]}
        onPress={() => onToggle(module.id)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.checkContainer}>
            {module.isCompleted ? (
              <Icon name="check-circle" size={26} color="#b2b2b2" />
            ) : (
              <View style={styles.checkCircle} />
            )}
          </View>
          <Text style={styles.moduleTitle}>{module.title}</Text>
        </View>
        <Icon
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={28}
          color="#001137"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {module.content?.map((item) => (
            <VideoContent key={item.id} content={item} />
          ))}
          {module.activities?.map((activity) => (
            <ActivityContent key={activity.id} activity={activity} />
          ))}
        </View>
      )}

      <View style={styles.separator} />
    </View>
  );
};

export default ModuleAccordion;

