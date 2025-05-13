// controllers/webhookController.js
require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const User    = require('../model/user');
const Premium = require('../model/premium');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  
  

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    try {
      // ✅ 1. Update User table
      await User.update({ isPremium: true }, { where: { id: userId } });

      // ✅ 2. Create Premium record
      await Premium.create({
        sessionId: session.id,
        status: session.payment_status,
        amount: session.amount_total / 100, // convert to ₹
        userId: userId
      });

      console.log(`✅ Premium activated for user ID ${userId}`);
    } catch (err) {
      console.error('❌ Failed to update premium status:', err);
    }
  }

  res.status(200).json({ received: true });
};