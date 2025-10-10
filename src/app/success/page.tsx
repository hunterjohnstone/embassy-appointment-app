// app/success/page.tsx
'use client';

import Link from 'next/link';

export default function SuccessPage() {
  // Clear the stored email
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('premiumEmail');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">You&apos;ve been upgraded to Premium tier. You&apos;ll receive instant notifications.</p>
        <Link 
          href="/windhoek"
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Return to Windhoek
        </Link>
      </div>
    </div>
  );
}