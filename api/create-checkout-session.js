// Make sure to install the Stripe package in your project: npm install stripe
// Also, ensure your Stripe Secret Key is set as an environment variable in Vercel.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Vercel serverless function to create a Stripe Checkout session.
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { userId, userEmail, priceId } = req.body;

    // Validate that the necessary data was sent from the frontend
    if (!userId || !userEmail || !priceId) {
        return res.status(400).json({ error: { message: "Missing required parameters: userId, userEmail, or priceId." } });
    }

    // 1. Find an existing Stripe customer by email. If one doesn't exist, create a new one.
    // This is crucial for linking payments to a user and for sending email receipts.
    let customer;
    const customerList = await stripe.customers.list({ email: userEmail, limit: 1 });

    if (customerList.data.length > 0) {
      // Use the existing customer record
      customer = customerList.data[0];
    } else {
      // Create a new customer in Stripe
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          // Store the Auth0 user ID in Stripe's metadata for future reference
          auth0_user_id: userId,
        },
      });
    }

    // 2. Create a Stripe Checkout Session for the customer
    const session = await stripe.checkout.sessions.create({
      customer: customer.id, // Link the session to the customer
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Set the mode to subscription for recurring payments
      success_url: `${req.headers.origin}/?payment=success`, // Redirect URL on successful payment
      cancel_url: `${req.headers.origin}/`, // Redirect URL if the user cancels
    });

    // 3. Send the session ID back to the frontend
    res.status(200).json({ sessionId: session.id });

  } catch (error) {
    console.error("Stripe API Error:", error);
    res.status(500).json({ error: { message: error.message } });
  }
}
