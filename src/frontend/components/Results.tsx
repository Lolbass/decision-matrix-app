import { useMemo } from 'react';
import { DecisionMatrix } from '../types/decisionMatrix';
import { calculateAllScores, getBestOption } from '../utils/scoreCalculator';
import { ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import './Results.css';

interface ResultsProps {
  matrix: DecisionMatrix;
}

export function Results({ matrix }: ResultsProps) {
  const scores = useMemo(() => calculateAllScores(matrix), [matrix]);
  const bestOption = useMemo(() => getBestOption(matrix), [matrix]);

  if (matrix.options.length === 0) {
    return (
      <div className="results-container">
        <div className="empty-state">
          <ChartBarIcon className="empty-icon" />
          <h3 className="empty-title">No Results Available</h3>
          <p className="empty-text">
            Add options and rate them to see results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="header-title">
          <ChartBarIcon className="header-icon" />
          <h2>Results</h2>
        </div>
      </div>

      <div className="results-grid">
        {[...matrix.options]
          .sort((a, b) => scores[b.id] - scores[a.id])
          .map((option, index) => {
            const score = scores[option.id];
            const isBest = bestOption?.id === option.id;
            
            return (
              <div 
                key={option.id} 
                className={`result-card ${isBest ? 'best-option' : ''}`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="card-header">
                  <div className="option-info">
                    <h4>{option.name}</h4>
                    {isBest && (
                      <div className="best-badge">
                        <TrophyIcon className="badge-icon" />
                      </div>
                    )}
                  </div>
                  <div className="score-value">{score.toFixed(1)}</div>
                </div>

                <div className="score-bar-container">
                  <div 
                    className="score-bar" 
                    style={{ width: `${(score / 5) * 100}%` }} 
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}