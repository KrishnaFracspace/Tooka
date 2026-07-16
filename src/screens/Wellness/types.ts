import { ImageSourcePropType } from 'react-native';

export interface WellnessBenefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface WellnessRecommendedSpa {
  id: string;
  image: ImageSourcePropType;
  name: string;
  rating: number;
  distance: string;
}

export interface WellnessArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  heroImage: ImageSourcePropType;
  body: string;
  benefits: WellnessBenefit[];
  didYouKnow: string;
  recommendedSpas: WellnessRecommendedSpa[];
}
