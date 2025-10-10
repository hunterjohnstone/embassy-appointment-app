'use client';

// import { loadStripe } from '@stripe/stripe-js';
import { Elements, EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';

let stripePromise;
if (rocess.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  stripePromise=process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
} else {
  return Error("Public stripe key couldnt be found ")
}

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the email from sessionStorage
    const premiumEmail = sessionStorage.getItem('premiumEmail');
    if (premiumEmail) {
      setEmail(premiumEmail);
      fetchClientSecret(premiumEmail);
    } else {
      // No email found, redirect back
      window.location.href = '/';
    }
  }, []);

 async function fetchClientSecret(formData) {
  const email = formData.get('email');
  const origin = (await headers()).get('origin')

  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: 'price_15Ge6RE6m4YKY3TKE5V0U1oz', // Your test price ID
          quantity: 1
        }
      ],
      mode: 'payment',
      customer_email: email, // Add customer email
      metadata: {
        location: 'windhoek',
        email: email
      },
      return_url: `${origin}/return`, // Fixed return URL
    })

    return { clientSecret: session.client_secret }
  } catch (error) {
    console.error('Stripe error:', error)
    throw error
  }
}

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Complete Your Payment</h1>
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckoutProvider>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </Elements>
        )}
      </div>
    </div>
  );
}