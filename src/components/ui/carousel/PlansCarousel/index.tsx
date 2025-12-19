import React from 'react';
import { View, Text } from 'react-native';
import Carousel from '../Carousel/index';
import PlanCard, { Plan } from '../PlanCard';
import { styles } from './styles';

type Props = {
  title: string;
  subtitle: string;
  plans: Plan[];
  onPlanPress?: (plan: Plan) => void;
  onPlanLike?: (plan: Plan) => void;
};

const PlansCarousel: React.FC<Props> = ({
  title,
  subtitle,
  plans,
  onPlanPress,
  onPlanLike,
}) => {
  if (!plans || plans.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      
      <View style={styles.carouselContainer}>
        <Carousel
          data={plans}
          renderItem={(plan) => (
            <PlanCard
              plan={plan}
              onPress={onPlanPress}
              onLike={onPlanLike}
            />
          )}
          keyExtractor={(plan) => plan.id}
          itemWidth={170}
          gap={10}
          showPagination={true}
          paginationSize="Large"
        />
      </View>
    </View>
  );
};

export default PlansCarousel;

