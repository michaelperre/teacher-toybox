import { buffer } from 'micro';
import { ManagementClient } from 'auth0';

// Initialize the Stripe library with your secret key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initialize the Auth0 Management Client.
const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_M2M_CLIENT_ID,
  clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET,
});

// Vercel's body parser can interfere with Stripe's signature verification.
// We disable it for this specific route.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify the event came from Stripe.
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error(`Stripe webhook signature error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Extract the Auth0 User ID from the session.
    const userId = session.client_reference_id;
    const premiumRoleId = process.env.AUTH0_PREMIUM_ROLE_ID;

    if (!userId) {
      console.error('Webhook Error: Missing client_reference_id (userId) in checkout session.');
      return res.status(400).send('Webhook Error: Missing client_reference_id.');
    }

    try {
      // **THE IMPORTANT FIX**: Assign the 'Premium' role to the user in Auth0.
      await auth0.users.assignRoles({ id: userId }, { roles: [premiumRoleId] });
      console.log(`Successfully assigned Premium role to user ${userId}`);
    } catch (err) {
      console.error(`Auth0 API Error: Failed to assign role to user ${userId}`, err);
      // Return a 500 error so Stripe will retry the webhook.
      return res.status(500).json({ error: 'Failed to assign role in Auth0.' });
    }
  }

  // Acknowledge receipt of the event.
  res.status(200).json({ received: true });
}