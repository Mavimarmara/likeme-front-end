import React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Title, ButtonGroup, PrimaryButton, SecondaryButton } from '@/components/ui';
import { GradientSplash4 } from '@/assets';
import { useAuthLogin } from '@/hooks/useAuthLogin';
import { styles } from './styles';

type Props = { navigation: any; route: any };

const IntroScreen: React.FC<Props> = ({ navigation, route }) => {
  const userName = route.params?.userName || 'Usuário';
  const { handleLogin, isLoading } = useAuthLogin(navigation);

  const handleShowPresentation = () => {
    navigation.navigate('AppPresentation' as never);
  };

  const handleGoToApp = () => {
    handleLogin();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.greetingContainer}>
          <Title
            title={`Hello, ${userName}!`}
            subtitle={`Wellcome to Like Me,\n\nFirst, can I introduce you to our app?`}
            variant="large"
            rightAdornment={<Image source={GradientSplash4} style={styles.titleAdornment} resizeMode="cover" />}
          />
        </View>

        <View style={styles.buttonContainer}>
          <ButtonGroup style={{ position: 'relative', left: 0, right: 0, bottom: 0, paddingBottom: 0 }}>
            <PrimaryButton label="Yes, sure" onPress={handleShowPresentation} disabled={isLoading} />
            <SecondaryButton label="No, I want to go straight to the app" onPress={handleGoToApp} loading={isLoading} />
          </ButtonGroup>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IntroScreen;
