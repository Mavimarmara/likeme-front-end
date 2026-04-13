import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { ResizeMode, Video, type Video as ExpoVideoRef } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  videoUri: string;
  onCollapse: () => void;
  containerStyle: StyleProp<ViewStyle>;
};

export const PostEmbeddedVideo: React.FC<Props> = ({ videoUri, onCollapse, containerStyle }) => {
  const videoRef = useRef<ExpoVideoRef>(null);

  const pauseAndUnload = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      await v.pauseAsync();
    } catch {
      /* ignore */
    }
    try {
      await v.unloadAsync();
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    return () => {
      void pauseAndUnload();
    };
  }, [pauseAndUnload]);

  return (
    <View style={containerStyle}>
      <Video
        key={videoUri}
        ref={videoRef}
        style={styles.video}
        source={{ uri: videoUri }}
        useNativeControls
        resizeMode={ResizeMode.COVER}
        isLooping={false}
        shouldPlay
      />
      <Pressable
        style={styles.collapseTouch}
        onPress={(e) => {
          e?.stopPropagation?.();
          void pauseAndUnload();
          onCollapse();
        }}
        accessibilityRole='button'
        accessibilityLabel='Voltar à capa do vídeo'
      >
        <View style={styles.collapseInner}>
          <Icon name='keyboard-arrow-down' size={26} color='rgba(255,255,255,0.95)' />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
    minHeight: 200,
  },
  collapseTouch: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  collapseInner: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    padding: 4,
  },
});
