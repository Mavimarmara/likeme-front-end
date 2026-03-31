import { Platform } from 'react-native';
import { BlurView, type BlurViewProps } from 'expo-blur';

const ANDROID_BLUR_METHOD: BlurViewProps['experimentalBlurMethod'] =
  Platform.OS === 'android' ? 'dimezisBlurView' : undefined;

export function PlatformBlurView({ experimentalBlurMethod, ...rest }: BlurViewProps) {
  return <BlurView {...rest} experimentalBlurMethod={experimentalBlurMethod ?? ANDROID_BLUR_METHOD} />;
}
