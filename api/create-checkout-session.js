// File location: /api/create-checkout-session.js

// You will need to install the Stripe Node.js library for this to work
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { priceId, userId, userEmail } = req.body;

      // Create a Checkout Session.
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${req.headers.origin}/?payment=success`,
        cancel_url: `${req.headers.origin}/`,
        client_reference_id: userId, // Link the Stripe customer to your Auth0 user
        customer_email: userEmail,   // Pre-fill the customer's email address
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: { message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}