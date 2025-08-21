// /api/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    // Vercel automatically parses the body for you
    const { userId, priceId } = req.body;
    const siteUrl = process.env.SITE_URL;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${siteUrl}?payment=success`,
            cancel_url: siteUrl,
            client_reference_id: userId, // Pass the Auth0 user ID
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};