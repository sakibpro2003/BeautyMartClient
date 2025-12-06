export type TShadeRecommendation = {
  product?: string;
  reason?: string;
  confidence?: number;
};

export type TShadeQuiz = {
  _id?: string;
  skinTone: string;
  undertone: string;
  skinType: string;
  concerns: string[];
  preferredFinish?: string;
  preferredCoverage?: string;
  currentShade?: string;
  lighting?: string;
  photoConsent?: boolean;
  notes?: string;
  recommendations?: TShadeRecommendation[];
  confidence?: number;
  createdAt?: string;
};
