import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogoutButton, Title, FloatingMenu } from '@/components/ui';
import { storageService } from '@/services';
import { useMenuItems } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import type { StoredUser } from '@/types/auth';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rootNavigation = navigation.getParent() ?? navigation;
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await storageService.getUser();
      setUser(storedUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = useMenuItems(navigation);

  const handleLogout = () => {
    rootNavigation.reset({
      index: 0,
      routes: [{ name: 'Unauthenticated' as never }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Title title={t('profile.title')} variant="large" />

          {user && (
            <View style={styles.userInfo}>
              {user.picture && <Image source={{ uri: user.picture }} style={styles.avatar} />}

              <View style={styles.userDetails}>
                {user.name && <Text style={styles.userName}>{user.name}</Text>}

                {user.email && <Text style={styles.userEmail}>{user.email}</Text>}

                {user.nickname && <Text style={styles.userNickname}>@{user.nickname}</Text>}
              </View>
            </View>
          )}

          {loading ? (
            <View style={styles.notLoggedIn}>
              <Text style={styles.notLoggedInText}>{t('profile.loading')}</Text>
            </View>
          ) : !user ? (
            <View style={styles.notLoggedIn}>
              <Text style={styles.notLoggedInText}>{t('auth.notLoggedIn')}</Text>
            </View>
          ) : null}

          {user && (
            <View style={styles.logoutContainer}>
              <LogoutButton label={t('auth.logout')} onPress={handleLogout} />
            </View>
          )}
        </View>
      </ScrollView>
      <FloatingMenu items={menuItems} selectedId="profile" />
    </SafeAreaView>
  );
};

export default ProfileScreen;
