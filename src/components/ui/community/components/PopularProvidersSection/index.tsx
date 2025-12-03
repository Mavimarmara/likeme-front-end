import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar?: string;
}

type Props = {
  providers: Provider[];
  onProviderPress?: (provider: Provider) => void;
};

const PopularProvidersSection: React.FC<Props> = ({
  providers,
  onProviderPress,
}) => {
  if (!providers || providers.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Most Popular Providers</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {providers.map((provider) => (
          <TouchableOpacity
            key={provider.id}
            style={styles.providerItem}
            activeOpacity={0.7}
            onPress={() => onProviderPress?.(provider)}
          >
            <View style={styles.avatarContainer}>
              {provider.avatar ? (
                <Image
                  source={{ uri: provider.avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>
                    {provider.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.providerName} numberOfLines={2}>
              {provider.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PopularProvidersSection;

