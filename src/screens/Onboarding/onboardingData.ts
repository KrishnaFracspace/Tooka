import { OnboardingStep } from './types';

export const onboardingData: OnboardingStep[] = [
  {
    id: 'step_1',
    title: 'What brings you to TOOKA today?',
    subtitle: "Select up to 3 - we'll personalize your feed",
    key: 'goals',
    options: [
      { id: 'relax_massage', label: 'Relax & Massage', icon: '👑' },
      { id: 'recovery_pain', label: 'Recovery & Pain Relief', icon: '🏃' },
      { id: 'beauty_skin', label: 'Beauty & Skin Care', icon: '✨' },
      { id: 'wellness_ayurveda', label: 'Wellness & Ayurveda', icon: '🌿' },
      { id: 'steam_spa', label: 'Steam & Spa', icon: '🧖' },
      { id: 'stress_relief', label: 'Stress Relief', icon: '😊' },
    ],
  },
  {
    id: 'step_2',
    title: 'What do you prefer?',
    subtitle: "Pick what matters most - we'll do the rest.",
    key: 'preferences',
    options: [
      { id: 'top_rated', label: 'Top Rated', icon: '⭐' },
      { id: 'nearby_spas', label: 'Nearby Spas', icon: '📍' },
      { id: 'premium', label: 'Premium', icon: '✨' },
      { id: 'authentic', label: 'Authentic', icon: '🌿' },
      { id: 'best_value', label: 'Best Value', icon: '💰' },
      { id: 'couple_friendly', label: 'Couple Friendly', icon: '💕' },
    ],
  },
];
