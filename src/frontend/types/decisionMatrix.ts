export type ScoringScale = 0 | 1 | 2 | 3 | 4 | 5;

export interface Option {
  id: string;
  name: string;
  description?: string;
  scores: Record<string, ScoringScale>;
}

export interface Criterion {
  id: string;
  name: string;
  weight: number;
  description?: string;
}

export interface DecisionMatrix {
  options: Option[];
  criteria: Criterion[];
} 