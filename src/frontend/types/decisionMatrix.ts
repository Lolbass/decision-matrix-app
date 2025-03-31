export interface Criterion {
  id: string;
  name: string;
  weight: number;
  description?: string;
}

export interface Option {
  id: string;
  name: string;
  description?: string;
  scores: Record<string, number>; // criterionId -> score
}

export interface DecisionMatrix {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  criteria: Criterion[];
  options: Option[];
  created_at: Date;
  updated_at: Date;
  active?: boolean;
}

export type ScoringScale = 1 | 2 | 3 | 4 | 5; 