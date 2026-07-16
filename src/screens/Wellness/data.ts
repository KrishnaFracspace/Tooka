import { WellnessArticle } from './types';

export const SAMPLE_ARTICLES: WellnessArticle[] = [
  {
    id: '1',
    title: 'The Art of Hot Stone Therapy',
    subtitle: 'Unlock the ancient secret to deep muscular relaxation and energetic balance.',
    category: 'THERAPY FOCUS',
    heroImage: { uri: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop' },
    body: 'Hot stone massage therapy is a specialist massage where the therapist uses smooth, heated stones as an extension of their own hands, or by placing them on specific points of the body. The heat can be both deeply relaxing and help warm up tight muscles so the therapist can work more deeply, more quickly.\n\nThe stones used are typically basalt, a type of volcanic rock that is very high in iron, which allows it to retain heat for a long duration. These stones are immersed in water and heated until they are within a certain temperature range (typically 120-130 degrees Fahrenheit) before being used in the treatment.',
    benefits: [
      {
        id: 'b1',
        icon: '🔥', // In a real app we might use Icon names like 'flame'
        title: 'Deep Heat',
        description: 'Penetrates layers of muscle for instant relief.',
      },
      {
        id: 'b2',
        icon: '✨',
        title: 'Stress Relief',
        description: 'Reduces cortisol levels and anxiety.',
      },
    ],
    didYouKnow: 'Basalt stones are chosen for their energetic properties. Many practitioners believe these volcanic rocks carry the grounded energy of the earth, helping to center your mind while healing your body.',
    recommendedSpas: [
      {
        id: 's1',
        image: { uri: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=400&auto=format&fit=crop' },
        name: 'Serenity Spa',
        rating: 4.8,
        distance: '1.2 km',
      },
      {
        id: 's2',
        image: { uri: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=400&auto=format&fit=crop' },
        name: 'The Calm Space',
        rating: 4.7,
        distance: '2.5 km',
      },
    ],
  },
];
