/* eslint-disable @typescript-eslint/no-explicit-any */

// /api/create-checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(request: Request) {
  try {
    const { email, location } = await request.json();
    const origin = request.headers.get('origin') || process.env.NEXTAUTH_URL;
    
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Instant Appointment Alert',
              description: `Instant notifications for ${location} embassy appointments`,
            },
            unit_amount: 50,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${origin}/success`,
      cancel_url: `${origin}/${location}`,
      metadata: {
        email,
        location,
        tier: 'paid'
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}