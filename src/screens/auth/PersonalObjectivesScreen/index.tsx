import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Title, Chip, PrimaryButton, SecondaryButton, ButtonGroup } from '@/components/ui';
import { GradientSplash3 } from '@/assets';
import { styles } from './styles';

type Props = { navigation: any; route: any };

const OBJECTIVES = [
  'Get to know me better',
  'Improve my habits',
  'Find wellbeing programs',
  'Improve my sleep',
  'Gain insights on my wellbeing',
  'Eat better',
  'Buy health products',
  'Find a community',
  'Track my treatment/program',
  'Move more',
  'Track my mood',
];

const PersonalObjectivesScreen: React.FC<Props> = ({ navigation, route }) => {
  const userName = route.params?.userName || 'Usuário';
  const [selectedObjectives, setSelectedObjectives] = useState<Set<string>>(new Set());

  const toggleObjective = (objective: string) => {
    const newSelected = new Set(selectedObjectives);
    if (newSelected.has(objective)) {
      newSelected.delete(objective);
    } else {
      newSelected.add(objective);
    }
    setSelectedObjectives(newSelected);
  };

  const handleNext = () => {
    navigation.navigate('Main' as never);
  };

  const handleSkip = () => {
    navigation.navigate('Main' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Title
            title={`${userName},`}
            variant="large"
            rightAdornment={<Image source={GradientSplash3} style={styles.titleAdornment} resizeMode="cover" />}
          />

          <Text style={styles.question}>
            What are the main things we can help you with?
          </Text>

          <View style={styles.chipsContainer}>
            {OBJECTIVES.map((objective) => (
              <Chip
                key={objective}
                label={objective}
                selected={selectedObjectives.has(objective)}
                onPress={() => toggleObjective(objective)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ButtonGroup style={styles.buttonGroup}>
          <PrimaryButton label="Next" onPress={handleNext} />
          <SecondaryButton label="Skip information" onPress={handleSkip} />
        </ButtonGroup>
      </View>
    </SafeAreaView>
  );
};

export default PersonalObjectivesScreen;

