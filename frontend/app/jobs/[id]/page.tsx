'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/lib/auth';
import { jobsAPI, resultsAPI } from '@/lib/api';
import { ArrowLeft, Download, FileText, Calendar, Activity } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const [user, setUser] = useState<any>(null);

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

  const { data: job, isLoading: jobLoading, error: jobError } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const response = await jobsAPI.get(parseInt(jobId));
      return response.data;
    },
    enabled: !!user && !!jobId,
    refetchInterval: (query) => {
      const jobData = query.state.data;
      return jobData?.status === 'pending' || jobData?.status === 'running' ? 3000 : false;
    },
  });

  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ['results', jobId],
    queryFn: async () => {
      const response = await resultsAPI.listByJob(parseInt(jobId));
      return response.data;
    },
    enabled: !!user && !!jobId && job?.status === 'completed',
  });

  const handleDownload = async () => {
    try {
      const response = await resultsAPI.download(parseInt(jobId));
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job_${jobId}_results.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Results may not be available yet.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/jobs"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Job Details
              </h1>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading job details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/jobs"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Job Details
              </h1>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            Job not found or error loading job details.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/jobs"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {job.name}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Job Status Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Job Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analysis Type: <span className="font-medium">{job.analysis_type}</span>
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  job.status
                )}`}
              >
                {job.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Created: {formatDate(job.created_at)}</span>
              </div>
              {job.completed_at && (
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Completed: {formatDate(job.completed_at)}</span>
                </div>
              )}
              {job.dataset_name && (
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <FileText className="h-4 w-4" />
                  <span>Dataset: {job.dataset_name}</span>
                </div>
              )}
            </div>

            {job.error_message && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                  Error Message
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400">{job.error_message}</p>
              </div>
            )}

            {(job.status === 'pending' || job.status === 'running') && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Analysis is {job.status}. This page will refresh automatically.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Parameters Card */}
          {job.parameters && Object.keys(job.parameters).length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Analysis Parameters
              </h2>
              <div className="space-y-2">
                {Object.entries(job.parameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Card */}
          {job.status === 'completed' && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Results
              </h2>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Analysis Results Package
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Includes PCA plots, clustering results, kinship matrix, and summary statistics
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download ZIP
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
