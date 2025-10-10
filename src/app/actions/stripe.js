'use server'

import { headers } from 'next/headers'

import { stripe } from '../../lib/stripe'

export async function fetchClientSecret() {
  const origin = (await headers()).get('origin')

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of
        // the product you want to sell
        price: 'price_1SGe6RE6m4YKY3TKE5VQUloz',
        quantity: 1
      }
    ],
    mode: 'payment',
    return_url: `${origin}/success`,
  })

  return session.client_secret
}