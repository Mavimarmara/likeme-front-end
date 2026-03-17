import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  StatusBar,
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
import { Header, Title, TextInput, PrimaryButton, SecondaryButton, ButtonGroup } from '@/components/ui';
import { personsService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import type { PersonData } from '@/types/person';
import type { RootStackParamList } from '@/types/navigation';
import { getNextOnboardingScreen } from '@/utils';
import {
  BIRTHDATE_MASK,
  parseWeightInput,
  parseHeightInput,
  formatBirthdateInput,
  birthdateToISO,
  ageFromBirthdateISO,
} from '@/utils/formatters/personFormats';
import { useLoadPersonalData } from '@/hooks';
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
const FULL_NAME_REGEX = /^[\p{L}\s]+$/u;

type Props = StackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'Register', screenClass: 'RegisterScreen' });
  const { t } = useTranslation();
  const { loadPersonalData } = useLoadPersonalData();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState(route.params?.userName || '');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSkipLoading, setIsSkipLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    birthdate?: string;
    gender?: string;
    weight?: string;
    height?: string;
  }>({});

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollContentRef = useRef<View>(null);
  const contentYRef = useRef(0);
  const containerYRef = useRef(0);
  const fieldYRef = useRef<Record<string, number>>({});
  const fullNameRowRef = useRef<View>(null);
  const birthdateRowRef = useRef<View>(null);
  const weightRowRef = useRef<View>(null);
  const heightRowRef = useRef<View>(null);
  const fullNameInputRef = useRef<RNTextInput>(null);
  const birthdateInputRef = useRef<RNTextInput>(null);
  const weightInputRef = useRef<RNTextInput>(null);
  const heightInputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e) =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () =>
      setKeyboardHeight(0),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadPersonalData().then((data) => {
      if (cancelled || !data) return;
      setFullName((prev) => (prev.trim() ? prev : data.fullName));
      setBirthdate(data.birthdate);
      setGender(data.gender);
      setWeight(data.weight);
      setHeight(data.height);
    });
    return () => {
      cancelled = true;
    };
  }, [loadPersonalData]);

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

  const handleFieldLayout = useCallback(
    (fieldKey: string) => (e: LayoutChangeEvent) => {
      fieldYRef.current[fieldKey] = contentYRef.current + containerYRef.current + e.nativeEvent.layout.y;
    },
    [],
  );

  const topSectionStyle = useMemo(() => [styles.topSection], []);

  const headerFixedStyle = useMemo(
    () => [
      {
        backgroundColor: COLORS.BACKGROUND_SECONDARY,
        paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 16 : 0),
      },
    ],
    [insets.top],
  );

  const validateNumericField = useCallback(
    (value: string, min: number, max: number, required: boolean): string | undefined => {
      if (!value.trim()) return required ? t('auth.requiredField') : undefined;
      const n = Number(value.trim());
      if (Number.isNaN(n)) return t('auth.validationInvalidNumber');
      if (n < min || n > max) {
        return t('auth.validationOutOfRange', { min: String(min), max: String(max) });
      }
      return undefined;
    },
    [t],
  );

  const handleNext = useCallback(async () => {
    try {
      setIsLoading(true);
      setFieldErrors({});

      const errors: {
        fullName?: string;
        birthdate?: string;
        gender?: string;
        weight?: string;
        height?: string;
      } = {};

      if (!fullName.trim()) {
        errors.fullName = t('auth.fillFullName');
      } else if (!FULL_NAME_REGEX.test(fullName.trim())) {
        errors.fullName = t('auth.validationInvalidFullName');
      }

      const birthdateISO = birthdate.trim() ? birthdateToISO(birthdate.trim()) : null;
      if (!birthdate.trim()) {
        errors.birthdate = t('auth.requiredField');
      } else if (!birthdateISO) {
        errors.birthdate = t('auth.validationInvalidBirthdate');
      } else {
        const age = ageFromBirthdateISO(birthdateISO);
        if (age == null || age < 1 || age > 120) {
          errors.birthdate = t('auth.validationOutOfRange', { min: '1', max: '120' });
        }
      }

      if (!gender.trim()) {
        errors.gender = t('auth.requiredField');
      }

      const weightNormalized = weight.trim().replace(/,/g, '.');
      const weightError = validateNumericField(weightNormalized, 1, 499, true);
      if (weightError) errors.weight = weightError;

      const heightNormalized = height.trim().replace(/,/g, '.');
      const heightError = validateNumericField(heightNormalized, 1, 499, true);
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
        gender: gender.trim(),
        birthdate: birthdateISO!,
        weight: weight.trim().replace(/,/g, '.'),
        height: height.trim().replace(/,/g, '.'),
      };

      await personsService.createOrUpdatePerson(personData);

      const nextScreen = getNextOnboardingScreen('Register');
      const params = {
        firstName: firstName || fullName.trim() || route.params?.userName || 'Usuário',
      };
      navigation.navigate(nextScreen as never, params as never);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('auth.registerError');
      console.error('Erro ao salvar dados da pessoa:', error);
      Alert.alert(t('common.error'), message);
    } finally {
      setIsLoading(false);
    }
  }, [fullName, gender, birthdate, weight, height, navigation, route.params?.userName, t, validateNumericField]);

  const handleSkip = useCallback(async () => {
    try {
      setIsSkipLoading(true);
      const firstName = fullName.trim().split(/\s+/)[0] || fullName || route.params?.userName || 'Usuário';
      const nextScreen = getNextOnboardingScreen('Register');
      const params = { firstName };
      navigation.navigate(nextScreen as never, params as never);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('auth.registerError');
      console.error('Erro ao pular registro:', error);
      Alert.alert(t('common.error'), message);
    } finally {
      setIsSkipLoading(false);
    }
  }, [fullName, navigation, route.params?.userName, t]);

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
        paddingBottom: keyboardHeight > 0 ? 0 : Math.max(insets.bottom, SPACING.MD),
      },
    ],
    [keyboardHeight, insets.bottom],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle='dark-content' backgroundColor={COLORS.BACKGROUND_SECONDARY} />

      <View style={styles.container}>
        <View style={headerFixedStyle}>
          <Header onBackPress={() => navigation.goBack()} />
        </View>

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
          keyboardShouldPersistTaps='handled'
        >
          <View ref={scrollContentRef} collapsable={false} style={styles.scrollContentInner}>
            <View style={topSectionStyle}>
              <View style={styles.headerContent}>
                <Title title={t('auth.registerTitle')} />
              </View>
            </View>

            <View style={styles.content} onLayout={handleContentLayout}>
              <View style={styles.infoSection}>
                <Text style={styles.infoText}>{t('auth.registerInfoMessage')}</Text>
                <Text style={styles.sectionLabel}>Dados Pessoais</Text>

                <View style={styles.fieldsContainer} onLayout={handleContainerLayout}>
                  <View
                    ref={fullNameRowRef}
                    collapsable={false}
                    style={styles.fieldRow}
                    onLayout={handleFieldLayout('fullName')}
                  >
                    <TextInput
                      ref={fullNameInputRef}
                      label={t('auth.fullName')}
                      value={fullName}
                      onChangeText={(v) => {
                        setFullName(v);
                        setFieldErrors((e) => (e.fullName ? { ...e, fullName: undefined } : e));
                      }}
                      placeholder={t('auth.fullNamePlaceholder')}
                      onFocus={() => scrollToFocusedField('fullName')}
                      returnKeyType='next'
                      onSubmitEditing={() => birthdateInputRef.current?.focus()}
                      blurOnSubmit={false}
                      errorText={fieldErrors.fullName}
                      required
                    />
                  </View>

                  <View
                    ref={birthdateRowRef}
                    collapsable={false}
                    style={styles.fieldRow}
                    onLayout={handleFieldLayout('birthdate')}
                  >
                    <TextInput
                      ref={birthdateInputRef}
                      label={t('auth.birthdate')}
                      value={birthdate}
                      onChangeText={(v) => {
                        setBirthdate(formatBirthdateInput(v));
                        setFieldErrors((e) => (e.birthdate ? { ...e, birthdate: undefined } : e));
                      }}
                      placeholder={BIRTHDATE_MASK}
                      keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                      onFocus={() => scrollToFocusedField('birthdate')}
                      errorText={fieldErrors.birthdate}
                      required
                    />
                  </View>

                  <View collapsable={false} style={styles.fieldRow} onLayout={handleFieldLayout('gender')}>
                    <View style={styles.genderLabelRow}>
                      <Text style={styles.genderLabel}>{t('auth.gender')}</Text>
                      <Text style={styles.requiredMark}> *</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.genderTouchable}
                      onPress={() => {
                        Keyboard.dismiss();
                        setGenderModalVisible(true);
                      }}
                      activeOpacity={0.7}
                      accessibilityLabel={
                        genderLabel ? `${t('auth.gender')}: ${genderLabel}` : t('auth.genderPlaceholder')
                      }
                      accessibilityRole='button'
                      accessibilityHint={t('auth.genderPlaceholder')}
                    >
                      <Text
                        style={[styles.genderTouchableText, !genderLabel && styles.genderPlaceholder]}
                        numberOfLines={1}
                      >
                        {genderLabel || t('auth.genderPlaceholder')}
                      </Text>
                      <Icon name='keyboard-arrow-down' size={24} color={COLORS.NEUTRAL.LOW.DARK} />
                    </TouchableOpacity>
                    {fieldErrors.gender ? <Text style={styles.fieldErrorText}>{fieldErrors.gender}</Text> : null}
                  </View>

                  <View
                    ref={weightRowRef}
                    collapsable={false}
                    style={styles.fieldRow}
                    onLayout={handleFieldLayout('weight')}
                  >
                    <TextInput
                      ref={weightInputRef}
                      label={t('auth.weight')}
                      value={weight}
                      onChangeText={(v) => {
                        setWeight(parseWeightInput(v));
                        setFieldErrors((e) => (e.weight ? { ...e, weight: undefined } : e));
                      }}
                      placeholder='60'
                      suffix=' Kg'
                      keyboardType='decimal-pad'
                      onFocus={() => scrollToFocusedField('weight')}
                      errorText={fieldErrors.weight}
                      required
                    />
                  </View>

                  <View
                    ref={heightRowRef}
                    collapsable={false}
                    style={styles.fieldRow}
                    onLayout={handleFieldLayout('height')}
                  >
                    <TextInput
                      ref={heightInputRef}
                      label={t('auth.height')}
                      value={height}
                      onChangeText={(v) => {
                        setHeight(parseHeightInput(v));
                        setFieldErrors((e) => (e.height ? { ...e, height: undefined } : e));
                      }}
                      placeholder='1,60'
                      suffix=' m'
                      keyboardType='decimal-pad'
                      onFocus={() => scrollToFocusedField('height')}
                      errorText={fieldErrors.height}
                      required
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
              label={isLoading ? t('common.saving') : t('common.save')}
              onPress={handleNext}
              disabled={isLoading || isSkipLoading}
            />
            <SecondaryButton
              label={t('common.configureLater')}
              onPress={handleSkip}
              disabled={isLoading || isSkipLoading}
            />
          </ButtonGroup>
        </View>
      </View>

      <Modal
        visible={genderModalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setGenderModalVisible(false)}
        accessibilityLabel={t('auth.gender')}
      >
        <TouchableOpacity
          style={styles.genderModalOverlay}
          activeOpacity={1}
          onPress={() => setGenderModalVisible(false)}
          accessibilityLabel={t('common.close')}
          accessibilityRole='button'
        >
          <View style={styles.genderModalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.genderModalHeader}>
              <Text style={styles.genderModalTitle}>{t('auth.gender')}</Text>
              <TouchableOpacity
                onPress={() => setGenderModalVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityLabel={t('common.close')}
                accessibilityRole='button'
              >
                <Icon name='close' size={24} color={COLORS.NEUTRAL.LOW.PURE} />
              </TouchableOpacity>
            </View>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.genderOption, gender === opt.value && styles.genderOptionSelected]}
                onPress={() => {
                  setGender(opt.value);
                  setGenderModalVisible(false);
                  setFieldErrors((e) => (e.gender ? { ...e, gender: undefined } : e));
                }}
                activeOpacity={0.7}
                accessibilityLabel={t(opt.i18nKey)}
                accessibilityRole='button'
                accessibilityState={{ selected: gender === opt.value }}
              >
                <Text style={[styles.genderOptionText, gender === opt.value && styles.genderOptionTextSelected]}>
                  {t(opt.i18nKey)}
                </Text>
                {gender === opt.value && <Icon name='check' size={22} color={COLORS.PRIMARY.PURE} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default RegisterScreen;
