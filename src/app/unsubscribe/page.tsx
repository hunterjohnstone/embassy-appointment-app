'use client';

import React, { Suspense, useState } from 'react';
import Header from '../components/header';
import Link from 'next/link';

function UnsubscribePageContent() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="Appointment Finder" currentLanguage="en" />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Unsubscribe from Notifications
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Enter your email address below to stop receiving notifications about available appointments.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <form onSubmit={handleUnsubscribe} className="space-y-6">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg font-bold text-white transition-all shadow-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
              >
                {loading ? 'Unsubscribing...' : 'Unsubscribe'}
              </button>
            </form>

            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-green-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-medium text-sm">You have been successfully unsubscribed.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-red-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-medium text-sm">Error unsubscribing. Please try again.</p>
                </div>
              </div>
            )}
          </div>

          <p className="text-gray-500 text-sm">
            Changed your mind?{' '}
            <Link
              href="/"
              className="text-red-600 hover:text-red-700 font-medium underline underline-offset-2"
            >
              Go back to home page
            </Link>
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white py-6 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-sm">
            German Embassy Windhoek Appointment Finder © {new Date().getFullYear()}
          </p>
          <p className="text-gray-600 text-sm">E: hunterjohnst1@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnsubscribePageContent />
    </Suspense>
  );
}