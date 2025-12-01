'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, ArrowLeft, Sparkles, Zap, Crown } from 'lucide-react';
import { getUser } from '@/lib/auth';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (!userData) {
        router.push('/login');
      } else {
        setUser(userData);
        fetchSubscriptionStatus();
      }
    };
    fetchUser();

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [router]);

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/subscription/status`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSubscriptionStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // Create Razorpay order
      const orderResponse = await axios.post(
        `${apiUrl}/api/v1/subscription/create-order`,
        { amount: 999 },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { order_id, amount, currency, key_id } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: key_id,
        amount: amount * 100,
        currency: currency,
        name: 'PopStruct',
        description: 'Premium Subscription',
        order_id: order_id,
        handler: async function (response: any) {
          try {
            // Verify payment
            await axios.post(
              `${apiUrl}/api/v1/subscription/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            alert('Payment successful! You are now on the Premium plan.');
            router.push('/dashboard');
          } catch (error) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: user?.email || '',
          contact: ''
        },
        theme: {
          color: '#059669'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !subscriptionStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="h-8 w-8 text-gray-600" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">₹0</span>
              <span className="text-gray-600 dark:text-gray-400">/forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">2 analyses included</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Basic PCA analysis</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">K-means clustering</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Kinship matrix</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Export results</span>
              </li>
            </ul>
            {subscriptionStatus.subscription_tier === 'free' && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  Current Plan
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  {subscriptionStatus.jobs_remaining} analyses remaining
                </p>
              </div>
            )}
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 border-2 border-emerald-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 text-sm font-bold rounded-bl-lg">
              POPULAR
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="h-8 w-8 text-white" />
              <h3 className="text-2xl font-bold text-white">Premium</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₹999</span>
              <span className="text-emerald-50">/lifetime</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white font-medium">Unlimited analyses</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white">Advanced PCA with 3D plots</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white">All clustering algorithms</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white">Priority processing</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white">Export in multiple formats</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white">Email support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white">Lifetime access</span>
              </li>
            </ul>
            {subscriptionStatus.subscription_tier === 'premium' ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white font-medium">Current Plan</p>
                <p className="text-emerald-50 text-sm mt-1">
                  Enjoying unlimited analyses!
                </p>
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-white text-emerald-600 px-6 py-4 rounded-full hover:bg-emerald-50 transition-colors font-bold text-lg disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Upgrade Now
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            All payments are processed securely through Razorpay
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Supports UPI, Credit/Debit Cards, Net Banking, and Wallets
          </p>
        </div>
      </main>
    </div>
  );
}
