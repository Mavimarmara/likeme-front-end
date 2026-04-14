import React, { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Video, { type VideoRef } from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  videoUri: string;
  onCollapse: () => void;
  containerStyle: StyleProp<ViewStyle>;
};

const PostEmbeddedVideoInner: React.FC<Props> = ({ videoUri, onCollapse, containerStyle }) => {
  const videoRef = useRef<VideoRef>(null);

  const collapse = useCallback(() => {
    videoRef.current?.pause();
    onCollapse();
  }, [onCollapse]);

  return (
    <View style={containerStyle}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        controls
        resizeMode='cover'
        repeat={false}
        ignoreSilentSwitch='ignore'
        playInBackground={false}
      />
      <Pressable
        style={styles.collapseTouch}
        onPress={(e) => {
          e?.stopPropagation?.();
          collapse();
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

export const PostEmbeddedVideo: React.FC<Props> = (props) => <PostEmbeddedVideoInner key={props.videoUri} {...props} />;

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
