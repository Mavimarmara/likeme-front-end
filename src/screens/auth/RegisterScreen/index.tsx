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
import {
  Header,
  Title,
  TextInput,
  PrimaryButton,
  SecondaryButton,
  ButtonGroup,
} from '@/components/ui';
import { GradientSplash5 } from '@/assets';
import { storageService, personsService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import type { PersonData } from '@/types/person';
import { styles } from './styles';
import { COLORS } from '@/constants';

type Props = { navigation: any; route: any };

const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
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
        Alert.alert(t('auth.requiredField'), t('auth.fillFullName'));
        setIsLoading(false);
        return;
      }

      // Dividir fullName em firstName e lastName
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

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
      navigation.navigate('PersonalObjectives' as never, {
        userName: fullName || route.params?.userName || 'Usuário',
      });
    } catch (error: any) {
      console.error('Erro ao salvar dados da pessoa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    const now = new Date().toISOString();
    await storageService.setRegisterCompletedAt(now);
    navigation.navigate('PersonalObjectives' as never, {
      userName: fullName || route.params?.userName || 'Usuário',
    });
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
                <Title title={t('auth.registerTitle')} variant="large" />

                <View style={styles.invitationSection}>
                  <Text style={styles.invitationQuestion}>
                    {t('auth.registerInvitationQuestion')}
                  </Text>
                  <TextInput
                    label={t('auth.registerEnterCode')}
                    value={invitationCode}
                    onChangeText={setInvitationCode}
                    placeholder={t('auth.registerCodePlaceholder')}
                  />
                </View>
              </View>
            </View>

            <View style={styles.content}>
              <View style={styles.infoSection}>
                <Text style={styles.infoText}>
                  {t('auth.registerInfoMessage')}
                </Text>

                <View style={styles.fieldsContainer}>
                  <TextInput
                    label={t('auth.fullName')}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder={t('auth.fullNamePlaceholder')}
                  />

                  <TextInput
                    label={t('auth.age')}
                    value={age}
                    onChangeText={setAge}
                    placeholder={t('auth.agePlaceholder')}
                    keyboardType="numeric"
                  />

                  <TextInput
                    label={t('auth.gender')}
                    value={gender}
                    onChangeText={setGender}
                    placeholder={t('auth.genderPlaceholder')}
                  />

                  <TextInput
                    label={t('auth.weight')}
                    value={weight}
                    onChangeText={setWeight}
                    placeholder={t('auth.weightPlaceholder')}
                    keyboardType="numeric"
                  />

                  <TextInput
                    label={t('auth.height')}
                    value={height}
                    onChangeText={setHeight}
                    placeholder={t('auth.heightPlaceholder')}
                    keyboardType="numeric"
                  />

                  <TextInput
                    label={t('auth.insurance')}
                    value={insurance}
                    onChangeText={setInsurance}
                    placeholder={t('auth.insurancePlaceholder')}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <ButtonGroup style={styles.buttonGroup}>
              <PrimaryButton
                label={isLoading ? t('common.saving') : t('common.next')}
                onPress={handleNext}
                disabled={isLoading}
              />
              <SecondaryButton label={t('common.skipInformation')} onPress={handleSkip} disabled={isLoading} />
            </ButtonGroup>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
