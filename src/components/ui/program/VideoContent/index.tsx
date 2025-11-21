import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import type { ProgramContent } from '@/types/program';

type Props = {
  content: ProgramContent;
};

const VideoContent: React.FC<Props> = ({ content }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{content.title}</Text>
        <View style={styles.checkContainer}>
          <View style={styles.checkCircle} />
        </View>
      </View>

      <View style={styles.videoCard}>
        {content.thumbnail && (
          <Image
            source={{ uri: content.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
        <View style={styles.overlay}>
          <View style={styles.playButton}>
            <Icon name="play-arrow" size={48} color="#fbf7e5" />
          </View>
        </View>

        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{content.title.toUpperCase()}</Text>
          {content.duration && (
            <Text style={styles.videoDuration}>{content.duration}</Text>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.downloadButton} activeOpacity={0.7}>
            <Text style={styles.downloadButtonText}>Download</Text>
            <Icon name="download" size={18} color="#fbf7e5" />
          </TouchableOpacity>
          <View style={styles.volumeButton}>
            <Icon name="volume-off" size={24} color="#001137" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default VideoContent;

