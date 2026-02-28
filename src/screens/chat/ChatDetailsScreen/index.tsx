import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Background } from '@/components/ui/layout';
import { COLORS } from '@/constants';
import { storageService } from '@/services';
import type { CommunityStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

const ChatDetailsScreen: React.FC = () => {
  useAnalyticsScreen({ screenName: 'ChatDetails', screenClass: 'ChatDetailsScreen' });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CommunityStackParamList, 'ChatDetails'>>();
  const { channelName, channelAvatar } = route.params;

  const [userAvatarUri, setUserAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await storageService.getUser();
      setUserAvatarUri(user?.picture ?? null);
    };
    loadUser();
  }, []);

  const handleMenuPress = () => {
    const rootNavigation = navigation.getParent() ?? navigation;
    rootNavigation.navigate('Profile' as never);
  };

  const handleCartPress = () => {
    const rootNavigation = navigation.getParent() ?? navigation;
    rootNavigation.navigate('Cart' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Background />
      <Header
        showBackButton={false}
        showMenuWithAvatar
        onMenuPress={handleMenuPress}
        userAvatarUri={userAvatarUri}
        showCartButton={true}
        onCartPress={handleCartPress}
      />

      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name='chevron-left' size={24} color={COLORS.NEUTRAL.LOW.PURE} />
        </TouchableOpacity>
        <Text style={styles.title}>Dados do contato</Text>
      </View>

      <View style={styles.content}>
        {channelAvatar ? (
          <Image source={{ uri: channelAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name='person' size={56} color={COLORS.TEXT_LIGHT} />
          </View>
        )}
        <Text style={styles.contactName}>{channelName}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.deleteButton} activeOpacity={0.8}>
          <Text style={styles.deleteButtonText}>Excluir conversa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.blockButton} activeOpacity={0.8}>
          <Text style={styles.blockButtonText}>Bloquear contato</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatDetailsScreen;
