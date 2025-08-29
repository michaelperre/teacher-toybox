// In a NEW file: api/stripe-webhook.js

import { buffer } from 'micro';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth0Api = require('../utils/auth0-api'); // You will need a utility for Auth0

// Tell Vercel not to parse the request body, we need the raw version
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !webhookSecret) {
        throw new Error('Webhook secret or signature not found.');
    }
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const customer = await stripe.customers.retrieve(session.customer);
      const auth0UserId = customer.metadata.auth0_user_id;

      if (auth0UserId) {
        try {
          // You will need a function to assign the role in Auth0
          await auth0Api.assignPremiumRole(auth0UserId);
          console.log(`Successfully assigned Premium role to user ${auth0UserId}`);
        } catch (error) {
          console.error(`Failed to assign Premium role: ${error.message}`);
          return res.status(500).json({ error: 'Failed to update user role.' });
        }
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};

export default handler;
