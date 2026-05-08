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
  const formatEventTime = (value: string) => {
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      return '';
    }
    const parsedDate = new Date(normalizedValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return normalizedValue;
    }
    return parsedDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    const normalizedStartTime = formatEventTime(startTime);
    const normalizedEndTime = formatEventTime(endTime);

    if (normalizedStartTime && normalizedEndTime) {
      return `${normalizedStartTime} - ${normalizedEndTime}`;
    }

    return normalizedStartTime || normalizedEndTime;
  };

  const isImageUri = typeof event.thumbnail === 'string';
  const eventTimeRange = formatTimeRange(event.startTime, event.endTime);

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
                {eventTimeRange ? <Text style={styles.time}>{eventTimeRange}</Text> : null}
              </>
            )}
            {event.status === 'Scheduled' && eventTimeRange ? <Text style={styles.time}>{eventTimeRange}</Text> : null}
          </View>
        </View>
      </View>
    </View>
  );
};

export default EventBanner;
