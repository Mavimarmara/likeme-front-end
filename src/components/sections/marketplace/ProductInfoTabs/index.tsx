import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

type InfoTab = 'about' | 'objectives' | 'communities';

interface ProductInfoTabsProps {
  activeTab: InfoTab;
  onTabChange: (tab: InfoTab) => void;
}

export const ProductInfoTabs: React.FC<ProductInfoTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: InfoTab[] = ['about', 'objectives', 'communities'];
  const tabLabels: Record<InfoTab, string> = {
    about: 'About',
    objectives: 'Objectives',
    communities: 'Communities',
  };

  return (
    <View style={styles.infoTabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.infoTab, activeTab === tab && styles.infoTabActive]}
          onPress={() => onTabChange(tab)}
          activeOpacity={0.7}
        >
          <Text style={[styles.infoTabText, activeTab === tab && styles.infoTabTextActive]}>
            {tabLabels[tab]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
