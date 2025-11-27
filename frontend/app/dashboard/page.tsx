'use client';

import { useEffect, useState } from 'use';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getUser, logout } from '@/lib/auth';
import { datasetsAPI, jobsAPI } from '@/lib/api';
import { Database, Activity, FileText, LogOut, Plus } from 'lucide-react';
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

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            PopStruct
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user.email}
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full">
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Datasets
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {datasetsData?.total || 0}
                </p>
              </div>
              <Database className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {jobsData?.total || 0}
                </p>
              </div>
              <Activity className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Account Type
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                  {user.subscription_tier}
                </p>
              </div>
              <FileText className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/datasets/upload"
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Plus className="h-5 w-5 mr-2" />
              Upload New Dataset
            </Link>
            <Link
              href="/datasets"
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <Database className="h-5 w-5 mr-2" />
              View All Datasets
            </Link>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Jobs</h2>
            <Link
              href="/jobs"
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
            >
              View all
            </Link>
          </div>

          {jobsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
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
      </main>
    </div>
  );
}
