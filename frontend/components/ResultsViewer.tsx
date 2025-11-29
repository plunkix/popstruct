'use client';

import { useState, useEffect } from 'react';
import { resultsAPI } from '@/lib/api';
import { Download, BarChart3, TrendingUp, Users } from 'lucide-react';

interface ResultsViewerProps {
  jobId: number;
  onDownload?: () => void;
}

export default function ResultsViewer({ jobId, onDownload }: ResultsViewerProps) {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await resultsAPI.preview(jobId);
        setResults(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [jobId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  // Check if we have any data at all
  if (!results || (!results.metrics || Object.keys(results.metrics).length === 0)) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No results available yet.</p>
        {onDownload && (
          <button
            onClick={onDownload}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Raw Results
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      {results.metrics && Object.keys(results.metrics).length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {results.metrics.n_samples && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Samples Analyzed</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{results.metrics.n_samples}</p>
                </div>
                <Users className="h-12 w-12 text-blue-600 opacity-50" />
              </div>
            </div>
          )}

          {results.metrics.n_variants && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Genetic Variants</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">{results.metrics.n_variants.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-600 opacity-50" />
              </div>
            </div>
          )}

          {results.metrics.variance_explained && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Variance Explained (PC1+PC2)</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                    {((results.metrics.variance_explained[0] + results.metrics.variance_explained[1]) * 100).toFixed(1)}%
                  </p>
                </div>
                <BarChart3 className="h-12 w-12 text-purple-600 opacity-50" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visualization Tabs or Message */}
      {results.plots && results.plots.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4 px-6 overflow-x-auto">
              {results.plots.map((plot: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === index
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {plot.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {results.plots[activeTab] && (
              <div className="flex flex-col items-center">
                <img
                  src={results.plots[activeTab].data}
                  alt={results.plots[activeTab].name}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                  {results.plots[activeTab].name}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
          <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Plots Not Available
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Due to free tier storage limitations, plot images are not persisted. However, all your analysis metrics are shown above! Download the full results package to get all visualizations.
          </p>
        </div>
      )}

      {/* Download Button */}
      {onDownload && (
        <div className="flex justify-center">
          <button
            onClick={onDownload}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Full Results Package
          </button>
        </div>
      )}
    </div>
  );
}
