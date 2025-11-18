import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

export type LiveStatus = 'Live Now' | 'Scheduled';

export interface LiveBannerData {
  id: string;
  title: string;
  host: string;
  status: LiveStatus;
  startTime: string;
  endTime: string;
  thumbnail: ImageSourcePropType | string;
}

type Props = {
  live: LiveBannerData;
  onPress: (live: LiveBannerData) => void;
};

const LiveBanner: React.FC<Props> = ({ live, onPress }) => {
  const formatTime = (time: string) => {
    // Formata o horário (ex: "08:15 pm")
    return time;
  };

  const getTimeDisplay = () => {
    if (live.status === 'Live Now') {
      return `Live Now ${formatTime(live.startTime)} - ${formatTime(live.endTime)}`;
    }
    return `Scheduled ${formatTime(live.startTime)} - ${formatTime(live.endTime)}`;
  };

  const isImageUri = typeof live.thumbnail === 'string';

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {isImageUri ? (
          <Image source={{ uri: live.thumbnail }} style={styles.image} />
        ) : (
          <Image source={live.thumbnail} style={styles.image} />
        )}
        <View style={styles.imageOverlay} />
        <TouchableOpacity
          style={styles.liveButton}
          onPress={() => onPress(live)}
          activeOpacity={0.8}
        >
          <Text style={styles.liveButtonText}>Go to live</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.cameraIcon}>
          <Icon name="videocam" size={20} color="#000000" />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {live.title}
        </Text>
        <Text style={styles.host}>With {live.host}</Text>
        <Text style={styles.time}>{getTimeDisplay()}</Text>
      </View>
    </View>
  );
};

export default LiveBanner;

