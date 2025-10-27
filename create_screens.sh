#!/bin/bash

# Script para criar arquivos index.tsx e styles.ts para telas restantes

screens=(
  "src/screens/wellness/ProtocolScreen:ProtocolScreen"
  "src/screens/wellness/HealthProviderScreen:HealthProviderScreen"
  "src/screens/marketplace/MarketplaceScreen:MarketplaceScreen"
  "src/screens/community/CommunityScreen:CommunityScreen"
)

for screen_info in "${screens[@]}"; do
  IFS=':' read -r path name <<< "$screen_info"
  
  # Create index.tsx
  cat > "$path/index.tsx" << EOF
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

const $name: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>$name</Text>
        <Text style={styles.subtitle}>Funcionalidade em desenvolvimento</Text>
        {/* TODO: Implementar $name */}
      </View>
    </SafeAreaView>
  );
};

export default $name;
EOF

  # Create styles.ts
  cat > "$path/styles.ts" << EOF
import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
  },
  title: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
  },
});
EOF

  echo "Created files for $name"
done
