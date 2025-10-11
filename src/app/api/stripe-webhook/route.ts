// app/api/webhook/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { pool } from '@/lib/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    console.log('🔔 Webhook received');
    
    const sig = request.headers.get('stripe-signature');
    const body = await request.text();
    
    
    console.log('Webhook body length:', body.length);
    console.log('Stripe signature present:', !!sig);
    
    if (!sig) {
      console.error('❌ No stripe-signature header');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('❌ STRIPE_WEBHOOK_SECRET missing');
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(
      body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('✅ Webhook verified, event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_details?.email;
      const location = session.metadata?.location || 'unknown'; // Get location from metadata

      
      console.log('🛒 Checkout session completed:', {
        sessionId: session.id,
        email: email,
        metadata: session.metadata
      });
      
      if (!email) {
        console.error('❌ No email found in session');
        throw new Error('No email found in session');
      }
      if (!location) {
        console.error('❌ No Location found in session');
        throw new Error('No Location found in session');      
      }

      // SECURE: Upgrade to paid tier
      const result = await client.query(
        `INSERT INTO emails (email, location, tier) 
         VALUES ($1, $2, 'paid')
         ON CONFLICT (email) 
         DO UPDATE SET tier = 'paid'`,
        [email, location]
      );
      
      console.log(`✅ Upgraded ${email} to paid tier via Stripe ${location}, rows affected:`, result.rowCount);
    } else {
      console.log('ℹ️ Other event type:', event.type);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  } finally {
    client.release();
  }
}