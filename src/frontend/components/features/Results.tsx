import { DecisionMatrix } from '../../../shared/types/matrix.types';
import { ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useScores } from '../../hooks/useScores';
import '../../../styles/components/features/Results.css';

interface ResultsProps {
  matrix: DecisionMatrix;
}

export function Results({ matrix }: ResultsProps) {
  const { scores, bestOption, sortedOptions } = useScores(matrix);

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
    <div className="results-container p-4">
      <div className="results-header mb-4">
        <div className="header-title">
          <ChartBarIcon className="header-icon" />
          <h2>Results</h2>
        </div>
      </div>
      <div className="results-table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Option</th>
              <th>Score</th>
              <th>Visualization</th>
            </tr>
          </thead>
          <tbody>
            {sortedOptions.map((option, index) => {
              const score = scores[option.id];
              const isBest = bestOption?.id === option.id;
              const scorePercentage = (score / 5) * 100;
              
              return (
                <tr 
                  key={option.id} 
                  className={isBest ? 'best-option-row' : ''}
                >
                  <td className="rank-cell">{index + 1}</td>
                  <td className="option-cell">
                    <div className="option-name">
                      {option.name}
                      {isBest && <TrophyIcon className="mini-trophy-icon" />}
                    </div>
                    {option.description && (
                      <div className="option-description">{option.description}</div>
                    )}
                  </td>
                  <td className="score-cell">{score.toFixed(1)}</td>
                  <td className="bar-cell">
                    <div className="score-bar-container">
                      <div 
                        className="score-bar" 
                        style={{ width: `${scorePercentage}%` }}
                      >
                        {scorePercentage > 40 && (
                          <span className="bar-score">{score.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}