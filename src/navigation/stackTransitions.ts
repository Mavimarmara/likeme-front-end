import { Platform, Easing } from 'react-native';
import type { StackCardStyleInterpolator } from '@react-navigation/stack';

export const STACK_GESTURE_ENABLED = Platform.OS !== 'android';

/**
 * Transicao "fast fade" usada como `transitionSpec` em todos os stacks do app.
 */
export const fastFadeTransition = {
  open: { animation: 'timing' as const, config: { duration: 200, easing: Easing.out(Easing.ease) } },
  close: { animation: 'timing' as const, config: { duration: 150, easing: Easing.in(Easing.ease) } },
};

/**
 * Interpolator de card "so opacity". Mais leve que `forFadeFromCenter`, que
 * adiciona `transform: scale` por baixo do fade — esse scale obriga o RN a
 * repintar a screen inteira em cada frame da transicao.
 */
export const forSimpleFade: StackCardStyleInterpolator = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});
