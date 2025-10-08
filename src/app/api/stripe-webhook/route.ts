// /api/stripe-webhook/route.ts - PRIVATE endpoint  

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { pool } from '@/lib/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    // Stripe webhook verification (not API key)
    const sig = request.headers.get('stripe-signature');
    const body = await request.text();
    
    const event = stripe.webhooks.constructEvent(
      body, 
      sig!, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_details?.email;
      
      if (!email) {
        throw new Error('No email found in session');
      }

      // SECURE: Upgrade to paid tier
      await client.query(
        `INSERT INTO emails (email, location, tier) 
         VALUES ($1, $2, 'paid')
         ON CONFLICT (email) 
         DO UPDATE SET tier = 'paid'`,
        [email, session.metadata?.location || 'windhoek']
      );
      
      console.log(`✅ Upgraded ${email} to paid tier via Stripe webhook`);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  } finally {
    client.release();
  }
}