import Link from 'next/link';
import { ArrowRight, BarChart3, Users, Database } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">PopStruct</div>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Population Structure Analysis
            <br />
            <span className="text-blue-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Analyze genomic data with PCA, clustering, and kinship analysis.
            Upload your VCF or CSV files and get insights in minutes.
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">PCA Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Principal Component Analysis to visualize population structure
              and identify genetic relationships.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">K-means Clustering</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Automated population clustering with silhouette scoring and
              cluster visualization.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Kinship Matrix</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Calculate identity-by-state (IBS) or genomic relationship matrices
              (GRM) to assess relatedness.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
