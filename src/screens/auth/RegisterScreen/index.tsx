import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, Title, TextInput, PrimaryButton, SecondaryButton, ButtonGroup } from '@/components/ui';
import { GradientSplash5 } from '@/assets';
import { storageService, personsService, PersonData } from '@/services';
import { styles } from './styles';
import { COLORS } from '@/constants';

type Props = { navigation: any; route: any };

const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [invitationCode, setInvitationCode] = useState('');
  const [fullName, setFullName] = useState(route.params?.userName || '');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [insurance, setInsurance] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const topSectionStyle = useMemo(
    () => [
      styles.topSection,
      {
        paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 16 : 0),
      },
    ],
    [insets.top]
  );

  const handleNext = async () => {
    try {
      setIsLoading(true);

      // Validação dos campos obrigatórios
      if (!fullName.trim()) {
        Alert.alert('Campo obrigatório', 'Por favor, preencha o nome completo.');
        setIsLoading(false);
        return;
      }

      // Dividir fullName em firstName e lastName
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || firstName;

      // Preparar dados para a API
      const personData: PersonData = {
        firstName,
        lastName,
        ...(gender.trim() && { gender: gender.trim() }),
        ...(age.trim() && { age: age.trim() }),
        ...(weight.trim() && { weight: weight.trim() }),
        ...(height.trim() && { height: height.trim() }),
        ...(insurance.trim() && { insurance: insurance.trim() }),
      };

      // Salvar dados na API
      await personsService.createOrUpdatePerson(personData);

      // Salvar timestamp de registro completo
      const now = new Date().toISOString();
      await storageService.setRegisterCompletedAt(now);

      // Navegar para a próxima tela
      navigation.navigate('PersonalObjectives' as never, { userName: fullName || route.params?.userName || 'Usuário' });
    } catch (error: any) {
      console.error('Erro ao salvar dados da pessoa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    const now = new Date().toISOString();
    await storageService.setRegisterCompletedAt(now);
    navigation.navigate('PersonalObjectives' as never, { userName: fullName || route.params?.userName || 'Usuário' });
  };

  const adornmentSize = windowWidth * 0.45;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND_SECONDARY} />

      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={topSectionStyle}>
              <Header onBackPress={() => navigation.goBack()} />

              <View style={styles.headerContent}>
                <Image
                  source={GradientSplash5}
                  style={[
                    styles.titleAdornment,
                    {
                      width: adornmentSize,
                      height: adornmentSize,
                      right: -adornmentSize * 0.25,
                      top: -adornmentSize * 0.36,
                    },
                  ]}
                  resizeMode="contain"
                />
                <Title
                  title="Let's start,"
                  variant="large"
                />

                <View style={styles.invitationSection}>
                  <Text style={styles.invitationQuestion}>Did you come from a provider's invitation?</Text>
                  <TextInput
                    label="Enter code"
                    value={invitationCode}
                    onChangeText={setInvitationCode}
                    placeholder="Code"
                  />
                </View>
              </View>
            </View>

            <View style={styles.content}>
              <View style={styles.infoSection}>
                <Text style={styles.infoText}>
                  For us to be able to personalize your experience, we need some more information.
                </Text>

                <View style={styles.fieldsContainer}>
                  <TextInput
                    label="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Full Name"
                  />

                  <TextInput
                    label="Age"
                    value={age}
                    onChangeText={setAge}
                    placeholder="Age"
                    keyboardType="numeric"
                  />

                  <TextInput
                    label="Gender"
                    value={gender}
                    onChangeText={setGender}
                    placeholder="Gender"
                  />

                  <TextInput
                    label="Weight"
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="Weight"
                    keyboardType="numeric"
                  />

                  <TextInput
                    label="Height"
                    value={height}
                    onChangeText={setHeight}
                    placeholder="Height"
                    keyboardType="numeric"
                  />

                  <TextInput
                    label="Insurance"
                    value={insurance}
                    onChangeText={setInsurance}
                    placeholder="Insurance"
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <ButtonGroup style={styles.buttonGroup}>
              <PrimaryButton 
                label={isLoading ? 'Salvando...' : 'Next'} 
                onPress={handleNext} 
                disabled={isLoading}
              />
              <SecondaryButton 
                label="Skip information" 
                onPress={handleSkip}
                disabled={isLoading}
              />
            </ButtonGroup>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
