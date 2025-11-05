import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Title, Chip, PrimaryButton, SecondaryButton, ButtonGroup, Loading } from '@/components/ui';
import { GradientSplash3 } from '@/assets';
import { personalObjectivesService } from '@/services';
import { PersonalObjective } from '@/types';
import { showError } from '@/utils';
import { styles } from './styles';

type Props = { navigation: any; route: any };

const PersonalObjectivesScreen: React.FC<Props> = ({ navigation, route }) => {
  const userName = route.params?.userName || 'Usuário';
  const [objectives, setObjectives] = useState<PersonalObjective[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadObjectives();
  }, []);

  const loadObjectives = async () => {
    try {
      setLoading(true);
      const response = await personalObjectivesService.getPersonalObjectives({
        page: 1,
        limit: 100,
      });
      setObjectives(response.data.objectives);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar objetivos';
      showError(navigation, errorMessage, () => {
        loadObjectives();
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleObjective = (objectiveId: string) => {
    const newSelected = new Set(selectedObjectives);
    if (newSelected.has(objectiveId)) {
      newSelected.delete(objectiveId);
    } else {
      newSelected.add(objectiveId);
    }
    setSelectedObjectives(newSelected);
  };

  const handleNext = () => {
    navigation.navigate('SelfAwarenessIntro' as never);
  };

  const handleSkip = () => {
    navigation.navigate('SelfAwarenessIntro' as never);
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

          {loading ? (
            <Loading message="Carregando objetivos..." />
          ) : (
            <View style={styles.chipsContainer}>
              {objectives.map((objective) => (
                <Chip
                  key={objective.id}
                  label={objective.name}
                  selected={selectedObjectives.has(objective.id)}
                  onPress={() => toggleObjective(objective.id)}
                />
              ))}
            </View>
          )}
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

