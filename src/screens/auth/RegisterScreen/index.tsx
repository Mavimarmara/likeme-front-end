import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Keyboard,
  Modal,
  TouchableOpacity,
  TextInput as RNTextInput,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';
import { COLORS, SPACING } from '@/constants';
import { useAnalyticsScreen } from '@/analytics';

/** Valores enviados à API; labels vêm do i18n */
const GENDER_OPTIONS = [
  { value: 'female', i18nKey: 'auth.genderFemale' },
  { value: 'male', i18nKey: 'auth.genderMale' },
  { value: 'non_binary', i18nKey: 'auth.genderNonBinary' },
  { value: 'other', i18nKey: 'auth.genderOther' },
  { value: 'prefer_not_to_say', i18nKey: 'auth.genderPreferNotToSay' },
] as const;

const KEYBOARD_RESPIRATION = 24;
const SCROLL_FOCUS_OFFSET_PX = 80;
const SCROLL_PADDING_WHEN_KEYBOARD_OPEN = 120;

type Props = StackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'Register', screenClass: 'RegisterScreen' });
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  // Código de convite: coletado na UI; enviar à API quando o backend suportar.
  const [invitationCode, setInvitationCode] = useState('');
  const [fullName, setFullName] = useState(route.params?.userName || '');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [insurance, setInsurance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSkipLoading, setIsSkipLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ age?: string; weight?: string; height?: string }>({});

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollContentRef = useRef<View>(null);
  const contentYRef = useRef(0);
  const containerYRef = useRef(0);
  const fieldYRef = useRef<Record<string, number>>({});
  const fullNameRowRef = useRef<View>(null);
  const ageRowRef = useRef<View>(null);
  const weightRowRef = useRef<View>(null);
  const heightRowRef = useRef<View>(null);
  const insuranceRowRef = useRef<View>(null);
  const fullNameInputRef = useRef<RNTextInput>(null);
  const ageInputRef = useRef<RNTextInput>(null);
  const weightInputRef = useRef<RNTextInput>(null);
  const heightInputRef = useRef<RNTextInput>(null);
  const insuranceInputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const scrollToFocusedField = useCallback((fieldKey: string) => {
    const scrollView = scrollViewRef.current;
    const y = fieldYRef.current[fieldKey];
    if (scrollView == null || typeof y !== 'number') return;
    const offsetY = Math.max(0, y - SCROLL_FOCUS_OFFSET_PX);
    scrollView.scrollTo({ y: offsetY, animated: true });
  }, []);

  const handleContentLayout = useCallback((e: LayoutChangeEvent) => {
    contentYRef.current = e.nativeEvent.layout.y;
  }, []);

  const handleContainerLayout = useCallback((e: LayoutChangeEvent) => {
    containerYRef.current = e.nativeEvent.layout.y;
  }, []);

  const handleFieldLayout = useCallback((fieldKey: string) => (e: LayoutChangeEvent) => {
    fieldYRef.current[fieldKey] =
      contentYRef.current + containerYRef.current + e.nativeEvent.layout.y;
  }, []);

  const topSectionStyle = useMemo(
    () => [
      styles.topSection,
      {
        paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 16 : 0),
      },
    ],
    [insets.top]
  );

  const validateNumericField = useCallback(
    (value: string, min: number, max: number): string | undefined => {
      if (!value.trim()) return undefined;
      const n = Number(value.trim());
      if (Number.isNaN(n)) return t('auth.validationInvalidNumber');
      if (n < min || n > max) return t('auth.validationOutOfRange', { min: String(min), max: String(max) });
      return undefined;
    },
    [t]
  );

  const handleNext = useCallback(async () => {
    try {
      setIsLoading(true);
      setFieldErrors({});

      if (!fullName.trim()) {
        Alert.alert(t('auth.requiredField'), t('auth.fillFullName'));
        setIsLoading(false);
        return;
      }

      const errors: { age?: string; weight?: string; height?: string } = {};
      const ageError = validateNumericField(age, 1, 120);
      if (ageError) errors.age = ageError;
      const weightError = validateNumericField(weight, 1, 499);
      if (weightError) errors.weight = weightError;
      const heightError = validateNumericField(height, 30, 299);
      if (heightError) errors.height = heightError;

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setIsLoading(false);
        return;
      }

      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const personData: PersonData = {
        firstName,
        lastName,
        ...(gender.trim() && { gender: gender.trim() }),
        ...(age.trim() && { age: age.trim() }),
        ...(weight.trim() && { weight: weight.trim() }),
        ...(height.trim() && { height: height.trim() }),
        ...(insurance.trim() && { insurance: insurance.trim() }),
      };

      await personsService.createOrUpdatePerson(personData);

      const now = new Date().toISOString();
      await storageService.setRegisterCompletedAt(now);

      navigation.navigate('PersonalObjectives', {
        userName: fullName || route.params?.userName || 'Usuário',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('auth.registerError');
      console.error('Erro ao salvar dados da pessoa:', error);
      Alert.alert(t('common.error'), message);
    } finally {
      setIsLoading(false);
    }
  }, [fullName, gender, age, weight, height, insurance, navigation, route.params?.userName, t, validateNumericField]);

  const handleSkip = useCallback(async () => {
    try {
      setIsSkipLoading(true);
      const now = new Date().toISOString();
      await storageService.setRegisterCompletedAt(now);
      navigation.navigate('PersonalObjectives', {
        userName: fullName || route.params?.userName || 'Usuário',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('auth.registerError');
      console.error('Erro ao pular registro:', error);
      Alert.alert(t('common.error'), message);
    } finally {
      setIsSkipLoading(false);
    }
  }, [fullName, navigation, route.params?.userName, t]);

  const adornmentSize = windowWidth * 0.45;

  const genderLabel = useMemo(() => {
    if (!gender) return '';
    const opt = GENDER_OPTIONS.find((o) => o.value === gender);
    return opt ? t(opt.i18nKey) : gender;
  }, [gender, t]);

  const footerStyle = useMemo(
    () => [
      styles.footer,
      {
        bottom: keyboardHeight > 0 ? keyboardHeight + KEYBOARD_RESPIRATION : 0,
        paddingBottom:
          keyboardHeight > 0
            ? 0
            : Math.max(insets.bottom, SPACING.MD),
      },
    ],
    [keyboardHeight, insets.bottom]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND_SECONDARY} />

      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              keyboardHeight > 0 && {
                paddingBottom: keyboardHeight + SCROLL_PADDING_WHEN_KEYBOARD_OPEN,
              },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <View ref={scrollContentRef} collapsable={false} style={styles.scrollContentInner}>
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

              <View style={styles.content} onLayout={handleContentLayout}>
                <View style={styles.infoSection}>
                  <Text style={styles.infoText}>
                    {t('auth.registerInfoMessage')}
                  </Text>

                  <View style={styles.fieldsContainer} onLayout={handleContainerLayout}>
                    <View ref={fullNameRowRef} collapsable={false} style={styles.fieldRow} onLayout={handleFieldLayout('fullName')}>
                      <TextInput
                        ref={fullNameInputRef}
                        label={t('auth.fullName')}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder={t('auth.fullNamePlaceholder')}
                        onFocus={() => scrollToFocusedField('fullName')}
                        returnKeyType="next"
                        onSubmitEditing={() => ageInputRef.current?.focus()}
                        blurOnSubmit={false}
                      />
                    </View>

                    <View ref={ageRowRef} collapsable={false} style={styles.fieldRow} onLayout={handleFieldLayout('age')}>
                      <TextInput
                        ref={ageInputRef}
                        label={t('auth.age')}
                        value={age}
                        onChangeText={(v) => { setAge(v); setFieldErrors((e) => (e.age ? { ...e, age: undefined } : e)); }}
                        placeholder={t('auth.agePlaceholder')}
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                        onFocus={() => scrollToFocusedField('age')}
                        error={fieldErrors.age}
                      />
                    </View>

                    <View collapsable={false} style={styles.fieldRow} onLayout={handleFieldLayout('gender')}>
                      <Text style={styles.genderLabel}>{t('auth.gender')}</Text>
                      <TouchableOpacity
                        style={styles.genderTouchable}
                        onPress={() => { Keyboard.dismiss(); setGenderModalVisible(true); }}
                        activeOpacity={0.7}
                        accessibilityLabel={genderLabel ? `${t('auth.gender')}: ${genderLabel}` : t('auth.genderPlaceholder')}
                        accessibilityRole="button"
                        accessibilityHint={t('auth.genderPlaceholder')}
                      >
                        <Text
                          style={[
                            styles.genderTouchableText,
                            !genderLabel && styles.genderPlaceholder,
                          ]}
                          numberOfLines={1}
                        >
                          {genderLabel || t('auth.genderPlaceholder')}
                        </Text>
                        <Icon name="keyboard-arrow-down" size={24} color={COLORS.NEUTRAL.LOW.DARK} />
                      </TouchableOpacity>
                    </View>

                    <View ref={weightRowRef} collapsable={false} style={styles.fieldRow} onLayout={handleFieldLayout('weight')}>
                      <TextInput
                        ref={weightInputRef}
                        label={t('auth.weight')}
                        value={weight}
                        onChangeText={(v) => { setWeight(v); setFieldErrors((e) => (e.weight ? { ...e, weight: undefined } : e)); }}
                        placeholder={t('auth.weightPlaceholder')}
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                        onFocus={() => scrollToFocusedField('weight')}
                        error={fieldErrors.weight}
                      />
                    </View>

                    <View ref={heightRowRef} collapsable={false} style={styles.fieldRow} onLayout={handleFieldLayout('height')}>
                      <TextInput
                        ref={heightInputRef}
                        label={t('auth.height')}
                        value={height}
                        onChangeText={(v) => { setHeight(v); setFieldErrors((e) => (e.height ? { ...e, height: undefined } : e)); }}
                        placeholder={t('auth.heightPlaceholder')}
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                        onFocus={() => scrollToFocusedField('height')}
                        error={fieldErrors.height}
                      />
                    </View>

                    <View ref={insuranceRowRef} collapsable={false} style={styles.fieldRow} onLayout={handleFieldLayout('insurance')}>
                      <TextInput
                        ref={insuranceInputRef}
                        label={t('auth.insurance')}
                        value={insurance}
                        onChangeText={setInsurance}
                        placeholder={t('auth.insurancePlaceholder')}
                        onFocus={() => scrollToFocusedField('insurance')}
                        returnKeyType="done"
                        onSubmitEditing={() => Keyboard.dismiss()}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={footerStyle}>
            <ButtonGroup style={styles.buttonGroup}>
              <PrimaryButton
                label={isLoading ? t('common.saving') : t('common.next')}
                onPress={handleNext}
                disabled={isLoading || isSkipLoading}
              />
              <SecondaryButton
                label={t('common.skipInformation')}
                onPress={handleSkip}
                disabled={isLoading || isSkipLoading}
              />
            </ButtonGroup>
          </View>
        </KeyboardAvoidingView>
      </View>

      <Modal
        visible={genderModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGenderModalVisible(false)}
        accessibilityLabel={t('auth.gender')}
      >
        <TouchableOpacity
          style={styles.genderModalOverlay}
          activeOpacity={1}
          onPress={() => setGenderModalVisible(false)}
          accessibilityLabel={t('common.close')}
          accessibilityRole="button"
        >
          <View
            style={styles.genderModalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.genderModalHeader}>
              <Text style={styles.genderModalTitle}>{t('auth.gender')}</Text>
              <TouchableOpacity
                onPress={() => setGenderModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityLabel={t('common.close')}
                accessibilityRole="button"
              >
                <Icon name="close" size={24} color={COLORS.NEUTRAL.LOW.PURE} />
              </TouchableOpacity>
            </View>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.genderOption, gender === opt.value && styles.genderOptionSelected]}
                onPress={() => {
                  setGender(opt.value);
                  setGenderModalVisible(false);
                }}
                activeOpacity={0.7}
                accessibilityLabel={t(opt.i18nKey)}
                accessibilityRole="button"
                accessibilityState={{ selected: gender === opt.value }}
              >
                <Text style={[styles.genderOptionText, gender === opt.value && styles.genderOptionTextSelected]}>
                  {t(opt.i18nKey)}
                </Text>
                {gender === opt.value && (
                  <Icon name="check" size={22} color={COLORS.PRIMARY.PURE} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default RegisterScreen;
