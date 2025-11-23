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

  const isImageUri = typeof live.thumbnail === 'string';

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {isImageUri ? (
          <Image source={{ uri: live.thumbnail as string }} style={styles.image} />
        ) : (
          <Image source={live.thumbnail as ImageSourcePropType} style={styles.image} />
        )}
        <View style={styles.imageOverlay}>
        <TouchableOpacity
          style={styles.liveButton}
          onPress={() => onPress(live)}
          activeOpacity={0.8}
        >
          <Text style={styles.liveButtonText}>Go to live</Text>
        </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.contentWrapper}>
          <View style={styles.titleSection}>
        <View style={styles.cameraIcon}>
              <Icon name="videocam" size={24} color="#001137" />
        </View>
            <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {live.title}
        </Text>
        <Text style={styles.host}>With {live.host}</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            {live.status === 'Live Now' && (
              <>
                <Text style={styles.timeLabel}>Live Now</Text>
                <Text style={styles.time}>
                  {formatTime(live.startTime)} - {formatTime(live.endTime)}
                </Text>
              </>
            )}
            {live.status === 'Scheduled' && (
              <Text style={styles.time}>
                {formatTime(live.startTime)} - {formatTime(live.endTime)}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default LiveBanner;

