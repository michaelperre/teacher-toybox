// Import the official Stripe library.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // --- CHANGE: Destructure userEmail from the request body ---
  const { userId, priceId, userEmail } = req.body;

  // --- CHANGE: Update validation to require userEmail ---
  if (!userId || !priceId || !userEmail) {
    return res.status(400).json({ error: 'Missing required parameters: userId, priceId, and userEmail' });
  }

  try {
    // Get the base URL from the request headers.
    const origin = req.headers.origin || 'https://www.teachertoybox.com';

    // Create a Checkout Session with Stripe.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // Define the URLs Stripe will redirect to on success or cancellation.
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/?payment=cancelled`,
      
      // Pass the Auth0 user ID to Stripe.
      // This links the Stripe payment directly to the user in your system.
      client_reference_id: userId,

      // --- CHANGE: Add the customer_email parameter ---
      // This tells Stripe where to send the receipt.
      customer_email: userEmail,
    });

    // Return the session ID to the front-end.
    res.status(200).json({ sessionId: session.id });

  } catch (err) {
    console.error('Stripe API Error:', err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}