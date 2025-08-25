// /api/stripe-webhook.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { ManagementClient } = require('auth0');

const auth0 = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_MGMT_CLIENT_ID,
    clientSecret: process.env.AUTH0_MGMT_CLIENT_SECRET,
});

// CORRECTED: Use module.exports for consistency with the rest of the file
module.exports.config = {
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

const webhookHandler = async (req, res) => {
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

        if (!userId) {
            return res.status(400).send('Webhook Error: Missing client_reference_id (userId) in checkout session.');
        }

        try {
            // CORRECTED: The function is auth0.roles.getAll and the response has a `data` property
            const rolesResponse = await auth0.roles.getAll({ name: 'Premium' });
            
            if (rolesResponse.data && rolesResponse.data.length > 0) {
                const premiumRoleId = rolesResponse.data[0].id;
                
                // CORRECTED: The function is auth0.users.assignRoles
                await auth0.users.assignRoles({ id: userId }, { roles: [premiumRoleId] });
                
                console.log(`Successfully assigned Premium role to user ${userId}`);
            } else {
                throw new Error("Could not find the 'Premium' role in Auth0.");
            }
        } catch (err) {
             console.error('Auth0 role assignment failed:', err);
             return res.status(500).json({ error: 'Failed to assign role.' });
        }
    }
    
    // Send a success response back to Stripe
    res.status(200).json({ received: true });
};

module.exports = webhookHandler;