import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Title, Chip, PrimaryButton, SecondaryButton, ButtonGroup, Loading } from '@/components/ui';
import { GradientSplash6 } from '@/assets';
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
  const { width: windowWidth } = useWindowDimensions();
  const adornmentStyle = useMemo(() => {
    const size = windowWidth * 0.45;
    return {
      width: size,
      height: size,
      right: -size * 0.10,
      top: -size * 0.3,
    };
  }, [windowWidth]);

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
    navigation.navigate('Community' as never);
  };

  const handleSkip = () => {
    navigation.navigate('Community' as never);
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
          <View style={styles.headerContainer}>
            <Image
              source={GradientSplash6}
              style={[styles.titleAdornment, adornmentStyle]}
              resizeMode="contain"
            />
          <Title
            title={`${userName},`}
            variant="large"
          />
          </View>

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

