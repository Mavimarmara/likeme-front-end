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
  findNodeHandle,
  TextInput as RNTextInput,
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
  const [invitationCode, setInvitationCode] = useState('');
  const [fullName, setFullName] = useState(route.params?.userName || '');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [insurance, setInsurance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollContentRef = useRef<View>(null);
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

  const scrollToFocusedField = useCallback(
    (rowRef: React.RefObject<View | null>) => {
      const row = rowRef.current;
      const content = scrollContentRef.current;
      const scrollView = scrollViewRef.current;
      if (!row || !content || !scrollView) return;
      const contentNode = findNodeHandle(content);
      if (contentNode == null) return;
      row.measureLayout(
        contentNode,
        (_x, y) => {
          const offsetY = Math.max(0, y - SCROLL_FOCUS_OFFSET_PX);
          scrollView.scrollTo({ y: offsetY, animated: true });
        },
        () => {}
      );
    },
    []
  );

  const topSectionStyle = useMemo(
    () => [
      styles.topSection,
      {
        paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 16 : 0),
      },
    ],
    [insets.top]
  );

  const handleNext = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!fullName.trim()) {
        Alert.alert(t('auth.requiredField'), t('auth.fillFullName'));
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
  }, [fullName, gender, age, weight, height, insurance, navigation, route.params?.userName, t]);

  const handleSkip = useCallback(async () => {
    try {
      const now = new Date().toISOString();
      await storageService.setRegisterCompletedAt(now);
      navigation.navigate('PersonalObjectives', {
        userName: fullName || route.params?.userName || 'Usuário',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('auth.registerError');
      console.error('Erro ao pular registro:', error);
      Alert.alert(t('common.error'), message);
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

              <View style={styles.content}>
                <View style={styles.infoSection}>
                  <Text style={styles.infoText}>
                    {t('auth.registerInfoMessage')}
                  </Text>

                  <View style={styles.fieldsContainer}>
                    <View ref={fullNameRowRef} collapsable={false} style={styles.fieldRow}>
                      <TextInput
                        ref={fullNameInputRef}
                        label={t('auth.fullName')}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder={t('auth.fullNamePlaceholder')}
                        onFocus={() => scrollToFocusedField(fullNameRowRef)}
                        returnKeyType="next"
                        onSubmitEditing={() => ageInputRef.current?.focus()}
                        blurOnSubmit={false}
                      />
                    </View>

                    <View ref={ageRowRef} collapsable={false} style={styles.fieldRow}>
                      <TextInput
                        ref={ageInputRef}
                        label={t('auth.age')}
                        value={age}
                        onChangeText={setAge}
                        placeholder={t('auth.agePlaceholder')}
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                        onFocus={() => scrollToFocusedField(ageRowRef)}
                      />
                    </View>

                    <View collapsable={false} style={styles.fieldRow}>
                      <Text style={styles.genderLabel}>{t('auth.gender')}</Text>
                      <TouchableOpacity
                        style={styles.genderTouchable}
                        onPress={() => setGenderModalVisible(true)}
                        activeOpacity={0.7}
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

                    <View ref={weightRowRef} collapsable={false} style={styles.fieldRow}>
                      <TextInput
                        ref={weightInputRef}
                        label={t('auth.weight')}
                        value={weight}
                        onChangeText={setWeight}
                        placeholder={t('auth.weightPlaceholder')}
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                        onFocus={() => scrollToFocusedField(weightRowRef)}
                      />
                    </View>

                    <View ref={heightRowRef} collapsable={false} style={styles.fieldRow}>
                      <TextInput
                        ref={heightInputRef}
                        label={t('auth.height')}
                        value={height}
                        onChangeText={setHeight}
                        placeholder={t('auth.heightPlaceholder')}
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                        onFocus={() => scrollToFocusedField(heightRowRef)}
                      />
                    </View>

                    <View ref={insuranceRowRef} collapsable={false} style={styles.fieldRow}>
                      <TextInput
                        ref={insuranceInputRef}
                        label={t('auth.insurance')}
                        value={insurance}
                        onChangeText={setInsurance}
                        placeholder={t('auth.insurancePlaceholder')}
                        onFocus={() => scrollToFocusedField(insuranceRowRef)}
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
                disabled={isLoading}
              />
              <SecondaryButton label={t('common.skipInformation')} onPress={handleSkip} disabled={isLoading} />
            </ButtonGroup>
          </View>
        </KeyboardAvoidingView>
      </View>

      <Modal
        visible={genderModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.genderModalOverlay}
          activeOpacity={1}
          onPress={() => setGenderModalVisible(false)}
        >
          <View
            style={styles.genderModalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.genderModalHeader}>
              <Text style={styles.genderModalTitle}>{t('auth.gender')}</Text>
              <TouchableOpacity onPress={() => setGenderModalVisible(false)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
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
