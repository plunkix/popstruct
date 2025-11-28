'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/lib/auth';
import { jobsAPI } from '@/lib/api';
import { Activity, ArrowLeft, FileText, Calendar } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function JobsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState(1);
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

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', page],
    queryFn: async () => {
      const response = await jobsAPI.list(page, pageSize);
      return response.data;
    },
    enabled: !!user,
    refetchInterval: 5000,
  });

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
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analysis Jobs
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            Error loading jobs. Please try again.
          </div>
        ) : data?.jobs?.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No analysis jobs yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload a dataset to start running population structure analysis
            </p>
            <Link
              href="/datasets/upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload Dataset
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-4 mb-6">
              {data?.jobs?.map((job: any) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {job.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Analysis Type: <span className="font-medium">{job.analysis_type}</span>
                      </p>
                      {job.dataset_name && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Dataset: {job.dataset_name}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {formatDate(job.created_at)}</span>
                    </div>
                    {job.completed_at && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Completed: {formatDate(job.completed_at)}</span>
                      </div>
                    )}
                  </div>

                  {job.error_message && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400">
                      Error: {job.error_message}
                    </div>
                  )}
                </Link>
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
      </main>
    </div>
  );
}
