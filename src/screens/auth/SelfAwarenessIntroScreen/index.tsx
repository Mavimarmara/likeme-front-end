import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, PrimaryButton, SecondaryButton, ButtonGroup } from '@/components/ui';
import { styles } from './styles';

type Props = { navigation: any };

const SelfAwarenessIntroScreen: React.FC<Props> = ({ navigation }) => {
  const handleTakeQuiz = () => {
    navigation.navigate('Main' as never);
  };

  const handleSkip = () => {
    navigation.navigate('Main' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            YOUR JOURNEY TO SELF-AWARENESS STARTS HERE!
          </Text>
          <Text style={styles.subtitle}>
            Pause for 2 minutes — let Like Me guide you toward your own balance
          </Text>
        </View>

        <View style={styles.footer}>
          <ButtonGroup style={styles.buttonGroup}>
            <PrimaryButton label="Take a Quizz" onPress={handleTakeQuiz} />
            <SecondaryButton label="Skip" onPress={handleSkip} />
          </ButtonGroup>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelfAwarenessIntroScreen;

