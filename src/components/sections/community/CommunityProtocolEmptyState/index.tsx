import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

type Props = {
  onExplorePress: () => void;
};

const CommunityProtocolEmptyState = ({ onExplorePress }: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {t('profile.memberProtocols.emptyTitle', {
            defaultValue: 'Você ainda não faz parte de um protocolo.',
          })}
        </Text>
        <Text style={styles.body}>
          {t('profile.memberProtocols.emptyBody', {
            defaultValue:
              'Quando você entrar em um protocolo na comunidade, ele aparecerá aqui para você acessar conteúdos e eventos.',
          })}
        </Text>
      </View>
      <TouchableOpacity style={styles.exploreButton} onPress={onExplorePress} activeOpacity={0.7}>
        <Text style={styles.exploreButtonText}>
          {t('profile.memberProtocols.exploreCta', { defaultValue: 'Explorar comunidades' })}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommunityProtocolEmptyState;
