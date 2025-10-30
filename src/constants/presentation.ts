export interface PresentationPage {
  id: string;
  image: string;
  title: string;
  description: string;
  order: number;
}

export const PRESENTATION_PAGES: PresentationPage[] = [
  {
    id: '1',
    image: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=Health+Tracking',
    title: 'So many tips and apps... and self care still feels confusing?',
    description:
      'Here, everything that matters is in one place - from health trackers, to wellbeing programs and a curated marketplace.',
    order: 1,
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/300x400/FF9800/FFFFFF?text=Wellness+Programs',
    title: 'Personalized wellness programs',
    description:
      'Get customized health plans based on your goals, preferences, and medical history.',
    order: 2,
  },
  {
    id: '3',
    image: 'https://via.placeholder.com/300x400/2196F3/FFFFFF?text=Health+Community',
    title: 'Connect with health professionals',
    description:
      'Access qualified doctors, nutritionists, and wellness coaches in our curated marketplace.',
    order: 3,
  },
];


