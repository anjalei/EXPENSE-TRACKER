const Premium = require('../model/premium');
const User = require("../model/user");
const cashfreeService = require('../services/cashfreeService');
const {Cashfree}=require('cashfree-pg');

const cashfree = new Cashfree({
  clientId:  process.env.APP_ID,
  clientSecret: process.env.SECRET_KEY,
  env: "SANDBOX",
});
   async function createOrder(req, res) {
  try {
    if (!req.user || !req.user.id || !req.user.email) {
      return res.status(401).json({ message: "User info missing from token" });
    }

    const orderAmount = req.body.amount || 100;
    const orderCurrency = 'INR';
    const orderId = `order_${Date.now()}`;

    const cfRequest = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,
      customer_details: {
        customer_id: String(req.user.id),
        customer_email: req.user.email,
        customer_phone: "9876543210"
      },
      order_meta: {
        return_url: 'http://localhost:3000/payment/confirm?order_id={order_id}&payment_session_id={payment_session_id}'
      }
    };

    const cfResponse = await cashfreeService.createOrder(cfRequest);

    const { order_id, payment_session_id, order_amount, order_currency, order_status } = cfResponse;
 

    await Premium.create({
  orderId: order_id,
  paymentSessionId: payment_session_id,
  orderAmount: order_amount,
  orderCurrency: order_currency,
  paymentStatus: order_status,
  userId: req.user.id
});
    res.json({ payment_session_id });
  } catch (error) {
    console.error("Error creating payment order:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
}

async function confirmPayment(req, res) {
  try {
    console.log("⚡ confirmPayment called with query:", req.query);
    const { order_id, payment_session_id } = req.query;

    if (!order_id || !payment_session_id) {
      return res.status(400).send("Missing order_id or payment_session_id");
    }

    const paymentStatusResponse = await cashfreeService.getPaymentStatus(order_id);
    console.log("📦 Raw status response:", paymentStatusResponse);

    const paymentStatus = paymentStatusResponse.order_status;
    if (!paymentStatus) {
      return res.status(400).send("Unable to fetch payment status");
    }

    if (paymentStatus === 'PAID' || paymentStatus === 'ACTIVE') {
      await Premium.update(
        { paymentStatus },
        { where: { OrderId: order_id } }
      );
      const premiumRecord = await Premium.findOne({ where: { OrderId: order_id } });
      if (premiumRecord?.userId) {
        const user = await User.findByPk(premiumRecord.userId);
        if (user) {
          await user.update({ isPremium: true });
          console.log(`✅ User ${user.username} upgraded to premium.`);
        }
      }
      return res.redirect('/premium.html?success=true');
    } else {
      return res.redirect('/premium.html?success=false');
    }

  } catch (error) {
    console.error('❌ Payment confirmation error:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  createOrder,confirmPayment
};