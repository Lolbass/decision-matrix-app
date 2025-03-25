export type ScoringScale = 0 | 1 | 2 | 3 | 4 | 5;

export interface Criterion {
  id: string;
  name: string;
  weight: number;
  description?: string;
  active?: boolean;
}

export interface Option {
  id: string;
  name: string;
  description?: string;
  scores: Record<string, ScoringScale>;
  active?: boolean;
}

export interface DecisionMatrix {
  id: string;
  name: string;
  description: string;
  criteria: Criterion[];
  options: Option[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  active?: boolean;
} 