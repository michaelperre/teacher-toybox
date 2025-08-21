// /api/stripe-webhook.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { ManagementClient } = require('auth0');

const auth0 = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_MGMT_CLIENT_ID,
    clientSecret: process.env.AUTH0_MGMT_CLIENT_SECRET,
});

// Vercel requires this config object to correctly handle the raw webhook body
export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper function to buffer the request from Stripe
async function buffer(readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

module.exports = async (req, res) => {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify the event is genuinely from Stripe
        event = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the 'payment successful' event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;

        try {
            // Get the 'Premium' role ID from Auth0
            const roles = await auth0.getRoles({ name_filter: 'Premium' });
            if (roles.length > 0) {
                const premiumRoleId = roles[0].id;
                // Assign the 'Premium' role to the user who just paid
                await auth0.assignRolestoUser({ id: userId }, { roles: [premiumRoleId] });
            }
        } catch (err) {
             console.error('Auth0 role assignment failed:', err);
             return res.status(500).json({ error: 'Failed to assign role.' });
        }
    }
    
    // Send a success response back to Stripe
    res.status(200).json({ received: true });
};