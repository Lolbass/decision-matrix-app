import React from 'react';
import { Option, Criterion } from '../types/decisionMatrix';

export interface OptionsManagerProps {
  options: Option[];
  criteria: Criterion[];
  onUpdate: (options: Option[]) => void;
}

export function OptionsManager(props: OptionsManagerProps): React.ReactElement; 