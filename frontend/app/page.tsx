import Link from 'next/link';
import { ArrowRight, BarChart3, Users, Database, Dna, Sprout, TrendingUp, Github, Linkedin, Mail, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dna className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              PopStruct
            </span>
          </div>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full mb-6">
                <Sprout className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Agricultural Genomics Platform
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Unlock the Power of
                <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Population Genomics
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Advanced genomic analysis for crop improvement and breeding programs.
                Analyze genetic diversity, population structure, and kinship relationships with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                >
                  Start Analyzing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 font-semibold"
                >
                  Learn More
                </Link>
              </div>
              <div className="mt-12 flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                  <span>Fast Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></div>
                  <span>Secure Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>Research Grade</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 rounded animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-teal-200 to-blue-200 dark:from-teal-800 dark:to-blue-800 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-emerald-200 dark:from-blue-800 dark:to-emerald-800 rounded animate-pulse w-4/6"></div>
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="h-24 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-8 w-8 text-emerald-600" />
                      </div>
                      <div className="h-24 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 rounded-lg flex items-center justify-center">
                        <Users className="h-8 w-8 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">Fast</div>
              <div className="text-gray-600 dark:text-gray-400">Analysis Speed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-400">Data Security</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">Cloud</div>
              <div className="text-gray-600 dark:text-gray-400">Based</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Methods Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Analysis Methods
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Industry-standard tools for comprehensive population genomic analysis
            </p>
          </div>

          {/* PCA Analysis */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">PCA Analysis Visualization</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Example scatter plot showing genetic clusters</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Principal Component Analysis</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Visualize Population Structure
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Principal Component Analysis (PCA) reduces the dimensionality of your genomic data
                  to reveal hidden patterns and population stratification. Perfect for visualizing
                  genetic relationships and identifying distinct clusters in your breeding populations.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Interactive 2D and 3D scatter plots</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Variance explained by each component</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Export-ready publication graphics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* K-means Clustering */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-4">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">K-means Clustering</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Automated Population Grouping
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  K-means clustering automatically identifies distinct genetic groups in your data.
                  Uses silhouette scoring to determine optimal cluster numbers and provides
                  detailed cluster assignments for each sample.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Automatic optimal cluster detection</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Silhouette score validation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Sample-level cluster assignments</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Clustering Visualization</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Example showing distinct genetic groups</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kinship Matrix */}
          <div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Database className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Kinship Matrix Heatmap</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Example relatedness matrix visualization</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4">
                  <Database className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Kinship Analysis</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Measure Genetic Relatedness
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Calculate identity-by-state (IBS) or genomic relationship matrices (GRM) to
                  assess relatedness between samples. Essential for breeding programs and
                  understanding population dynamics.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">IBS and GRM matrix calculation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Interactive heatmap visualization</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-1 mr-3 mt-1">
                      <ArrowRight className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Pairwise relatedness coefficients</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Fast, Powerful
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get from data to insights in three easy steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Upload Data</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload your VCF or CSV files securely to our cloud platform
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Run Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose your analysis type and let our algorithms do the work
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Get Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                View interactive visualizations and download publication-ready results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your Research?
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            Join researchers and breeders using PopStruct for their genomic analysis needs
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center bg-white text-emerald-600 px-8 py-4 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer / Connect Section */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Dna className="h-8 w-8 text-emerald-500" />
                <span className="text-2xl font-bold">PopStruct</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                A modern platform for population genomics analysis, built for agricultural
                research and crop improvement programs.
              </p>
              <div className="flex items-center space-x-4">
                <Link
                  href="https://github.com/yourusername"
                  target="_blank"
                  className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors"
                >
                  <Github className="h-5 w-5" />
                </Link>
                <Link
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  href="mailto:your.email@example.com"
                  className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
                Connect With Me
              </h3>
              <p className="text-gray-400 mb-4">
                Have questions or want to collaborate? Feel free to reach out!
              </p>
              <Link
                href="https://yourportfolio.com"
                target="_blank"
                className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <Globe className="h-5 w-5 mr-2" />
                View My Portfolio
              </Link>
              <div className="mt-6 space-y-2 text-sm text-gray-400">
                <p>Built with Next.js, FastAPI, and PostgreSQL</p>
                <p>Powered by scikit-learn and scikit-allel</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} PopStruct. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
