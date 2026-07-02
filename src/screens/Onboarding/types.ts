export interface OnboardingOption {
  id: string;
  label: string;
  icon: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  options: OnboardingOption[];
  key: 'goals' | 'preferences';
}

export interface OnboardingAnswers {
  goals: string[];
  preferences: string[];
}

export interface OnboardingStorageData {
  completed: boolean;
  version: number;
  completedAt: number;
  answers: OnboardingAnswers;
}
