// api/create-checkout-session.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { userId, userEmail, priceId } = req.body;

    // 1. Find an existing Stripe customer by email or create a new one.
    let customer;
    const customerList = await stripe.customers.list({ email: userEmail, limit: 1 });

    if (customerList.data.length > 0) {
      customer = customerList.data[0];
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          auth0_user_id: userId,
        },
      });
    }

    // 2. Create a Checkout Session for the customer
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/?payment=success`,
      cancel_url: `${req.headers.origin}/`,
    });

    res.status(200).json({ sessionId: session.id });

  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error: { message: error.message } });
  }
}
