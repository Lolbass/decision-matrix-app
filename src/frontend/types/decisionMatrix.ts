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
  createdAt: Date;
  updatedAt: Date;
}

export type ScoringScale = 1 | 2 | 3 | 4 | 5; 