import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { EventBannerData } from '@/types/event';
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

type Props = {
  event: EventBannerData;
  onPress: (event: EventBannerData) => void;
};

const EventBanner: React.FC<Props> = ({ event, onPress }) => {
  const { t } = useTranslation();
  const formatTime = (time: string) => {
    return time;
  };

  const isImageUri = typeof event.thumbnail === 'string';

  return (
    <View style={styles.container}>
      <View style={styles.imageSide}>
        {isImageUri ? (
          <Image source={{ uri: event.thumbnail as string }} style={styles.image} />
        ) : (
          <Image source={event.thumbnail as ImageSourcePropType} style={styles.image} />
        )}
        <View style={styles.imageOverlay}>
          <TouchableOpacity style={styles.ctaButton} onPress={() => onPress(event)} activeOpacity={0.8}>
            <Text style={styles.ctaButtonText}>{t('community.eventBanner.goToEvent')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.contentWrapper}>
          <View style={styles.titleSection}>
            <View style={styles.cameraIcon}>
              <Icon name='videocam' size={24} color='#001137' />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {event.title}
              </Text>
              <Text style={styles.host}>{t('community.eventBanner.withHost', { host: event.host })}</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            {event.status === 'Live Now' && (
              <>
                <Text style={styles.timeLabel}>{t('community.eventBanner.statusLiveNow')}</Text>
                <Text style={styles.time}>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </Text>
              </>
            )}
            {event.status === 'Scheduled' && (
              <Text style={styles.time}>
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default EventBanner;
