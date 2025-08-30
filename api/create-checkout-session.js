// Import the official Stripe library.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { userId, priceId, userEmail } = req.body; // Added userEmail

  // Basic validation to ensure we have the necessary data.
  if (!userId || !priceId || !userEmail) { // Added userEmail check
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
      client_reference_id: userId,
      
      // **THE FIX**: Pass the customer's email directly to the session.
      // This ensures Stripe has the email to create an invoice and send a receipt.
      customer_email: userEmail,
    });

    // Return the session ID to the front-end.
    res.status(200).json({ sessionId: session.id });

  } catch (err) {
    console.error('Stripe API Error:', err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
