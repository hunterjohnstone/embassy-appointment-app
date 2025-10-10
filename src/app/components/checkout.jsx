'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';

// Initialize stripePromise correctly
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the email from sessionStorage
    const premiumEmail = sessionStorage.getItem('premiumEmail');
    if (premiumEmail) {
      setEmail(premiumEmail);
      fetchClientSecret(premiumEmail);
    } else {
      // No email found, redirect back
      window.location.href = '/windhoek';
    }
  }, []);

  const fetchClientSecret = async (userEmail) => {
    try {
      const response = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else if (data.url) {
          // If using redirect checkout, redirect immediately
          window.location.href = data.url;
          return;
        }
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // If using embedded checkout and we have clientSecret
  if (clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Complete Your Payment</h1>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckoutProvider>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </Elements>
        </div>
      </div>
    );
  }

  // Fallback if no clientSecret
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Checkout Error</h1>
        <p className="text-gray-600 mb-4">Unable to load checkout. Please try again.</p>
        <button 
          onClick={() => window.location.href = '/windhoek'}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}