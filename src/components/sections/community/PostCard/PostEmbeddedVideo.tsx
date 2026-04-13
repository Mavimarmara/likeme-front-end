import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  videoUri: string;
  onCollapse: () => void;
  containerStyle: StyleProp<ViewStyle>;
};

export const PostEmbeddedVideo: React.FC<Props> = ({ videoUri, onCollapse, containerStyle }) => {
  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = false;
  });

  useEffect(() => {
    player.play();
    return () => {
      player.pause();
    };
  }, [player]);

  return (
    <View style={containerStyle}>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls
        contentFit='cover'
        fullscreenOptions={{ enable: true }}
      />
      <Pressable
        style={styles.collapseTouch}
        onPress={(e) => {
          e?.stopPropagation?.();
          player.pause();
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
