import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { userService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import { logger } from '@/utils/logger';

type Params = {
  hasAvatar: boolean;
  onAvatarChanged: (avatarUri: string | null) => void;
};

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.85,
};

async function openAppSettings(): Promise<void> {
  try {
    await Linking.openSettings();
  } catch (error) {
    logger.warn('[useProfileAvatarEditor] Falha ao abrir configurações do dispositivo', { cause: error });
  }
}

function fileNameFromUri(uri: string, fallback = 'avatar.jpg'): string {
  const segment = uri.split('/').pop();
  return segment?.includes('.') ? segment : fallback;
}

function mimeTypeFromUri(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.heic') || lower.endsWith('.heif')) return 'image/heic';
  return 'image/jpeg';
}

export function useProfileAvatarEditor({ hasAvatar, onAvatarChanged }: Params) {
  const { t } = useTranslation();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const closeSheet = useCallback(() => {
    if (uploading) return;
    setSheetVisible(false);
  }, [uploading]);

  const openSheet = useCallback(() => {
    setSheetVisible(true);
  }, []);

  const showPermissionDeniedAlert = useCallback(
    (messageKey: string) => {
      Alert.alert(t('common.error'), t(messageKey), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.avatarSheet.openSettings'), onPress: () => void openAppSettings() },
      ]);
    },
    [t],
  );

  const persistAvatar = useCallback(
    async (avatarUri: string | null) => {
      await userService.updateProfileAvatar(avatarUri);
      await userService.syncStoredUserPicture(avatarUri);
      onAvatarChanged(avatarUri);
      setSheetVisible(false);
    },
    [onAvatarChanged],
  );

  const uploadPickedImage = useCallback(
    async (asset: ImagePicker.ImagePickerAsset) => {
      const uri = asset.uri?.trim();
      if (!uri) {
        throw new Error('Imagem inválida.');
      }
      const mimeType = asset.mimeType ?? mimeTypeFromUri(uri);
      const fileName = asset.fileName ?? fileNameFromUri(uri);
      const publicUrl = await userService.uploadProfileAvatar(uri, mimeType, fileName);
      await persistAvatar(publicUrl);
    },
    [persistAvatar],
  );

  const runWithUploadGuard = useCallback(
    async (action: () => Promise<void>) => {
      if (uploading) return;
      setUploading(true);
      try {
        await action();
      } catch (error) {
        const httpError = error as Error & { status?: number };
        logger.error('[useProfileAvatarEditor] Falha ao atualizar foto de perfil', {
          status: httpError.status,
          message: httpError.message,
          cause: error,
        });
        const fallback = t('profile.avatarSheet.uploadError');
        const message = httpError.message?.trim() && httpError.message !== fallback ? httpError.message : fallback;
        Alert.alert(t('common.error'), message);
      } finally {
        setUploading(false);
      }
    },
    [t, uploading],
  );

  const pickFromLibrary = useCallback(() => {
    void runWithUploadGuard(async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showPermissionDeniedAlert('profile.avatarSheet.permissionGalleryDenied');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
      if (result.canceled || !result.assets[0]) return;
      await uploadPickedImage(result.assets[0]);
    });
  }, [runWithUploadGuard, showPermissionDeniedAlert, uploadPickedImage]);

  const takePhoto = useCallback(() => {
    void runWithUploadGuard(async () => {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        showPermissionDeniedAlert('profile.avatarSheet.permissionCameraDenied');
        return;
      }
      const result = await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS);
      if (result.canceled || !result.assets[0]) return;
      await uploadPickedImage(result.assets[0]);
    });
  }, [runWithUploadGuard, showPermissionDeniedAlert, uploadPickedImage]);

  const deletePhoto = useCallback(() => {
    Alert.alert(t('profile.avatarSheet.deleteConfirmTitle'), t('profile.avatarSheet.deleteConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.avatarSheet.deleteConfirmButton'),
        style: 'destructive',
        onPress: () => {
          void runWithUploadGuard(async () => {
            await persistAvatar(null);
          });
        },
      },
    ]);
  }, [persistAvatar, runWithUploadGuard, t]);

  return {
    sheetVisible,
    uploading,
    hasAvatar,
    openSheet,
    closeSheet,
    pickFromLibrary,
    takePhoto,
    deletePhoto,
    isBusy: uploading,
  };
}
