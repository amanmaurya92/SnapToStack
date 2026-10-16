export type StackType = 'react-tailwind' | 'html-tailwind' | 'vue-tailwind';

export interface GenerationStatus {
  isGenerating: boolean;
  stepMessage: string;
  progressPercent: number;
}

export interface AppSettings {
  geminiApiKey: string;
  model: string;
  selectedStack: StackType;
}

export interface PresetSample {
  id: string;
  title: string;
  category: string;
  previewUrl: string;
  description: string;
}
