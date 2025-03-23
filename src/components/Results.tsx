import React from 'react';
import { DecisionMatrix } from '../types/decisionMatrix';
import { calculateAllScores, getBestOption } from '../utils/scoreCalculator';
import { ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';

interface ResultsProps {
  matrix: DecisionMatrix;
}

export function Results({ matrix }: ResultsProps) {
  const scores = calculateAllScores(matrix);
  const bestOption = getBestOption(matrix);

  if (matrix.options.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center py-8">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Results</h3>
          <p className="mt-1 text-sm text-gray-500">Add options to see results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ChartBarIcon className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-900">Results</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <TrophyIcon className="h-6 w-6 text-yellow-500" />
          <h3 className="text-lg font-medium text-gray-900">Best Option</h3>
        </div>
        {bestOption && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
            <h4 className="text-xl font-semibold text-blue-900">{bestOption.name}</h4>
            {bestOption.description && (
              <p className="text-blue-700 mt-2">{bestOption.description}</p>
            )}
            <div className="mt-4 flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600">
                {scores[bestOption.id].toFixed(1)}
              </div>
              <div className="text-sm text-blue-500">/ 5.0</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">All Scores</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Option
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matrix.options.map(option => (
                <tr key={option.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{option.name}</div>
                    {option.description && (
                      <div className="text-sm text-gray-500">{option.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-900">
                        {scores[option.id].toFixed(1)}
                      </div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-200"
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