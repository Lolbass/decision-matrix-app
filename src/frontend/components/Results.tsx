import React from 'react';
import { DecisionMatrix } from '../types/decisionMatrix';
import { calculateAllScores, getBestOption } from '../utils/scoreCalculator';
import { ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import './Results.css';

interface ResultsProps {
  matrix: DecisionMatrix;
}

export function Results({ matrix }: ResultsProps) {
  const scores = calculateAllScores(matrix);
  const bestOption = getBestOption(matrix);

  if (matrix.options.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <ChartBarIcon className="empty-icon" />
          <h3 className="empty-title">No Results</h3>
          <p className="empty-text">Add options to see results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <ChartBarIcon className="header-icon" />
        <h2 className="header-title">Results</h2>
      </div>

      <div className="results-card">
        <div className="best-option-header">
          <TrophyIcon className="trophy-icon" />
          <h3 className="section-title">Best Option</h3>
        </div>
        {bestOption && (
          <div className="best-option-card">
            <h4 className="best-option-name">{bestOption.name}</h4>
            {bestOption.description && (
              <p className="best-option-description">{bestOption.description}</p>
            )}
            <div className="best-option-score">
              <div className="score-value">
                {scores[bestOption.id].toFixed(1)}
              </div>
              <div className="score-max">/ 5.0</div>
            </div>
          </div>
        )}
      </div>

      <div className="results-card">
        <h3 className="section-title">All Scores</h3>
        <div className="table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {matrix.options.map((option) => (
                <tr key={option.id}>
                  <td>
                    <div className="option-name">{option.name}</div>
                    {option.description && (
                      <div className="option-description">{option.description}</div>
                    )}
                  </td>
                  <td>
                    <div className="score-container">
                      <div className="score-text">
                        {scores[option.id].toFixed(1)}
                      </div>
                      <div className="score-bar-container">
                        <div
                          className="score-bar"
                          style={{ width: `${(scores[option.id] / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 