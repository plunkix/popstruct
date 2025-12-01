'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUser } from '@/lib/auth';
import { datasetsAPI, analysisAPI } from '@/lib/api';
import { Database, Plus, FileText, Calendar, ArrowLeft, Play, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function DatasetsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [processing, setProcessing] = useState<number | null>(null);
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (!userData) {
        router.push('/login');
      } else {
        setUser(userData);
      }
    };
    fetchUser();
  }, [router]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['datasets', page],
    queryFn: async () => {
      const response = await datasetsAPI.list(page, pageSize);
      return response.data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (datasetIds: number[]) => {
      await Promise.all(datasetIds.map(id => datasetsAPI.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      setSelectedDatasets([]);
      setShowDeleteConfirm(false);
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Failed to delete datasets');
      setShowDeleteConfirm(false);
    },
  });

  const handleRunAnalysis = async (datasetId: number, datasetName: string) => {
    setProcessing(datasetId);
    try {
      await analysisAPI.createFullAnalysis(
        datasetId,
        `Full Analysis - ${datasetName}`,
        { n_components: 10, n_clusters: 3 }
      );
      router.push('/jobs');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to start analysis');
    } finally {
      setProcessing(null);
    }
  };

  const toggleDatasetSelection = (datasetId: number) => {
    setSelectedDatasets(prev =>
      prev.includes(datasetId)
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDatasets.length === data?.datasets?.length) {
      setSelectedDatasets([]);
    } else {
      setSelectedDatasets(data?.datasets?.map((d: any) => d.id) || []);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedDatasets.length > 0) {
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedDatasets);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Datasets
              </h1>
            </div>
            <Link
              href="/datasets/upload"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Upload Dataset
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading datasets...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            Error loading datasets. Please try again.
          </div>
        ) : data?.datasets?.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No datasets yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload your first dataset to get started with population structure analysis
            </p>
            <Link
              href="/datasets/upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Upload Dataset
            </Link>
          </div>
        ) : (
          <>
            {data?.datasets?.length > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDatasets.length === data?.datasets?.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Select All</span>
                  </label>
                  {selectedDatasets.length > 0 && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedDatasets.length} selected
                    </span>
                  )}
                </div>
                {selectedDatasets.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </button>
                )}
              </div>
            )}
            <div className="grid gap-4 mb-6">
              {data?.datasets?.map((dataset: any) => (
                <div
                  key={dataset.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedDatasets.includes(dataset.id)}
                        onChange={() => toggleDatasetSelection(dataset.id)}
                        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className="h-6 w-6 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {dataset.name}
                          </h3>
                        </div>
                        {dataset.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {dataset.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(dataset.created_at)}</span>
                          </div>
                          <span>Type: {dataset.file_type.toUpperCase()}</span>
                          {dataset.n_samples && (
                            <span>Samples: {dataset.n_samples}</span>
                          )}
                          {dataset.n_variants && (
                            <span>Variants: {dataset.n_variants}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRunAnalysis(dataset.id, dataset.name)}
                      disabled={processing === dataset.id}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing === dataset.id ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Analysis
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {data && data.total > pageSize && (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {page} of {Math.ceil(data.total / pageSize)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(data.total / pageSize)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Delete {selectedDatasets.length} Dataset{selectedDatasets.length > 1 ? 's' : ''}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete {selectedDatasets.length === 1 ? 'this dataset' : `these ${selectedDatasets.length} datasets`}?
                This will also delete all associated analyses and results. This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
