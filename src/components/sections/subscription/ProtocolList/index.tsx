import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SubscriptionCatalogCard } from '@/components/ui/cards/SubscriptionCatalogCard';
import type { UserSubscriptionListItem } from '@/services/payment/subscriptionService';
import { styles } from './styles';

type Props = {
  subscriptions: UserSubscriptionListItem[];
  onSubscriptionPress: (subscription: UserSubscriptionListItem) => void;
  onExplorePress: () => void;
};

const ProtocolList = ({ subscriptions, onSubscriptionPress, onExplorePress }: Props) => {
  if (subscriptions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyTitle}>Você ainda não escolheu um protocolo ou serviço.</Text>
          <Text style={styles.emptyBody}>
            Estamos em fase Beta teste.{'\n'}
            Teremos novidades em breve.{'\n\n'}
            Navegue na(s) comunidade(s) e na aba shop e descubra o que combina com a sua jornada de bem-estar.
          </Text>
        </View>
        <TouchableOpacity style={styles.exploreButton} onPress={onExplorePress} activeOpacity={0.7}>
          <Text style={styles.exploreButtonText}>Explorar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {subscriptions.map((sub) => (
        <SubscriptionCatalogCard
          key={sub.id}
          title={sub.product.name}
          image={sub.product.image ?? ''}
          badges={sub.product.type ? [sub.product.type] : []}
          onPress={() => onSubscriptionPress(sub)}
          testID={`protocol-home-card-${sub.id}`}
        />
      ))}
    </View>
  );
};

export default ProtocolList;
