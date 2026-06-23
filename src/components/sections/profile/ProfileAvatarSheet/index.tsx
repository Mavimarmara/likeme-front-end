import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@/hooks/i18n';
import { COLORS, SPACING } from '@/constants';
import { styles } from './styles';

type SheetOption = {
  key: string;
  labelKey: string;
  icon: string;
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  visible: boolean;
  loading?: boolean;
  hasAvatar: boolean;
  onClose: () => void;
  onChooseLibrary: () => void;
  onTakePhoto: () => void;
  onDeletePhoto: () => void;
};

const BACKDROP_FADE_MS = 220;
const SHEET_SLIDE_MS = 280;
const SHEET_SLIDE_OFFSET = 360;

const ProfileAvatarSheet: React.FC<Props> = ({
  visible,
  loading = false,
  hasAvatar,
  onClose,
  onChooseLibrary,
  onTakePhoto,
  onDeletePhoto,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [renderModal, setRenderModal] = useState(visible);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_SLIDE_OFFSET)).current;
  const closingRef = useRef(false);

  const runEnterAnimation = useCallback(() => {
    backdropOpacity.setValue(0);
    sheetTranslateY.setValue(SHEET_SLIDE_OFFSET);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: BACKDROP_FADE_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: SHEET_SLIDE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetTranslateY]);

  const runExitAnimation = useCallback(
    (onFinished?: () => void) => {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: BACKDROP_FADE_MS,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: SHEET_SLIDE_OFFSET,
          duration: SHEET_SLIDE_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setRenderModal(false);
          closingRef.current = false;
          onFinished?.();
        }
      });
    },
    [backdropOpacity, sheetTranslateY],
  );

  useEffect(() => {
    if (visible) {
      closingRef.current = false;
      setRenderModal(true);
      return;
    }

    if (renderModal && !closingRef.current) {
      closingRef.current = true;
      runExitAnimation();
    }
  }, [renderModal, runExitAnimation, visible]);

  useEffect(() => {
    if (renderModal && visible) {
      runEnterAnimation();
    }
  }, [renderModal, runEnterAnimation, visible]);

  const handleClose = useCallback(() => {
    if (loading || closingRef.current) return;
    closingRef.current = true;
    runExitAnimation(onClose);
  }, [loading, onClose, runExitAnimation]);

  const options: SheetOption[] = [
    {
      key: 'library',
      labelKey: 'profile.avatarSheet.chooseFromLibrary',
      icon: 'photo-library',
      onPress: onChooseLibrary,
    },
    {
      key: 'camera',
      labelKey: 'profile.avatarSheet.takePhoto',
      icon: 'photo-camera',
      onPress: onTakePhoto,
    },
    ...(hasAvatar
      ? [
          {
            key: 'delete',
            labelKey: 'profile.avatarSheet.deleteCurrent',
            icon: 'delete-outline',
            onPress: onDeletePhoto,
            destructive: true,
          } satisfies SheetOption,
        ]
      : []),
  ];

  return (
    <Modal visible={renderModal} transparent animationType='none' onRequestClose={handleClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} disabled={loading} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: SPACING.GAP_20 + Math.max(insets.bottom, 16) },
            { transform: [{ translateY: sheetTranslateY }] },
          ]}
        >
          <View style={styles.handle} />
          {options.map((option, index) => (
            <View key={option.key}>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={option.onPress}
                activeOpacity={0.7}
                disabled={loading}
              >
                <Icon name={option.icon} size={26} color={option.destructive ? COLORS.ERROR : COLORS.TEXT} />
                <Text style={[styles.optionLabel, option.destructive ? styles.optionLabelDanger : null]}>
                  {t(option.labelKey)}
                </Text>
              </TouchableOpacity>
              {index < options.length - 1 ? <View style={styles.separator} /> : null}
            </View>
          ))}
          {loading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size='large' color={COLORS.TEXT} />
              <Text style={[styles.optionLabel, { marginTop: 12, textAlign: 'center' }]}>
                {t('profile.avatarSheet.uploading')}
              </Text>
            </View>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ProfileAvatarSheet;
