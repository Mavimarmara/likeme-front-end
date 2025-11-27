import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { styles } from './styles';
import { storageService } from '@/services';

type Props = {
  navigation: any;
  route: any;
};

const AuthenticatedScreen: React.FC<Props> = ({ navigation }) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const registerCompletedAt = await storageService.getRegisterCompletedAt();
        const objectivesSelectedAt = await storageService.getObjectivesSelectedAt();
        
        if (!registerCompletedAt) {
          navigation.replace('Register' as never);
        } else if (!objectivesSelectedAt) {
          navigation.replace('PersonalObjectives' as never, { userName: 'Usuário' } as never);
        } else {
          navigation.replace('Community' as never);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        navigation.replace('Register' as never);
      } finally {
        setIsChecking(false);
      }
    };

    checkOnboardingStatus();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} />
  );
};

export default AuthenticatedScreen;

