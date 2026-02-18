import { ImageSourcePropType } from 'react-native';
import { Presentation1, Presentation2, Presentation3, Presentation4 } from '@/assets';

export interface PresentationPage {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
  order: number;
}

export const PRESENTATION_PAGES: PresentationPage[] = [
  {
    id: '1',
    image: Presentation1,
    title: 'So many tips and apps... and self care still feels confusing?',
    description:
      'Here, everything that matters is in one place - from health trackers, to wellbeing programs and a curated marketplace.',
    order: 1,
  },
  {
    id: '2',
    image: Presentation2,
    title: 'Here, you’re the main character, so we start by exploring your lifestyle!',
    description:
      'Your body and mind and have unique markers. Each data shared or question answered helps us track them and guide you on what comes next.',
    order: 2,
  },
  {
    id: '3',
    image: Presentation3,
    title: 'No pressure. There’s no magic formula. There’s your way.',
    description:
      'We can track your habits, suggest self care programs, help you with health products refill and so much more... here, you call the shots.',
    order: 3,
  },
  {
    id: '4',
    image: Presentation4,
    title: 'Personalize seu bem-estar',
    description:
      'Veja como seus hábitos e a qualidade do seu corpo e mente impactam seu bem-estar.',
    order: 4,
  },
];
