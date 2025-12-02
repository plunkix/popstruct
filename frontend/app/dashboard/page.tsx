'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getUser, logout } from '@/lib/auth';
import { datasetsAPI, jobsAPI, resultsAPI } from '@/lib/api';
import { Database, Activity, FileText, LogOut, Plus, Download, CheckCircle, Dna } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
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

  const { data: datasetsData, isLoading: datasetsLoading } = useQuery({
    queryKey: ['datasets'],
    queryFn: async () => {
      const response = await datasetsAPI.list(1, 5);
      return response.data;
    },
    enabled: !!user,
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await jobsAPI.list(1, 5);
      return response.data;
    },
    enabled: !!user,
  });

  const handleLogout = () => {
    logout();
  };

  const handleDownload = async (jobId: number) => {
    try {
      const response = await resultsAPI.download(jobId);
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
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 dark:bg-gray-900">
      <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dna className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              PopStruct
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user.email}
            </span>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-xs font-semibold rounded-full">
              {user.subscription_tier}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Datasets
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {datasetsData?.total || 0}
                </p>
              </div>
              <Database className="h-12 w-12 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {jobsData?.total || 0}
                </p>
              </div>
              <Activity className="h-12 w-12 text-teal-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Account Type
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                  {user.subscription_tier}
                </p>
              </div>
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/datasets/upload"
              className="flex items-center justify-center p-4 border-2 border-dashed border-emerald-300 dark:border-emerald-600 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
            >
              <Plus className="h-5 w-5 mr-2 text-emerald-600" />
              <span className="text-gray-900 dark:text-white">Upload New Dataset</span>
            </Link>
            <Link
              href="/datasets"
              className="flex items-center justify-center p-4 border-2 border-dashed border-teal-300 dark:border-teal-600 rounded-lg hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
            >
              <Database className="h-5 w-5 mr-2 text-teal-600" />
              <span className="text-gray-900 dark:text-white">View All Datasets</span>
            </Link>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Jobs</h2>
            <Link
              href="/jobs"
              className="text-emerald-600 hover:text-teal-600 text-sm font-semibold transition-colors"
            >
              View all
            </Link>
          </div>

          {jobsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : jobsData?.jobs?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No jobs yet. Upload a dataset to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {jobsData?.jobs?.map((job: any) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {job.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {job.analysis_type}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formatDate(job.created_at)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Completed Results */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Completed Results</h2>
            <Link
              href="/jobs"
              className="text-emerald-600 hover:text-teal-600 text-sm font-semibold transition-colors"
            >
              View all jobs
            </Link>
          </div>

          {jobsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : jobsData?.jobs?.filter((j: any) => j.status === 'completed').length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No completed analyses yet. Upload a dataset and run analysis to see results here!
            </p>
          ) : (
            <div className="space-y-6">
              {jobsData?.jobs
                ?.filter((job: any) => job.status === 'completed')
                .slice(0, 1)
                .map((job: any) => (
                  <div key={job.id}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {job.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Completed {formatDate(job.completed_at)}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-emerald-600 hover:text-teal-600 text-sm font-semibold transition-colors"
                      >
                        View Full Details →
                      </Link>
                    </div>
                    {/* Import and use ResultsViewer here - we'll do this in the next step */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Analysis completed successfully!
                      </p>
                      <button
                        onClick={() => handleDownload(job.id)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download Results
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
