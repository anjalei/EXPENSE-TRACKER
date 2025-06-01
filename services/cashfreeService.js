require('dotenv').config();
const { Cashfree } = require("cashfree-pg");

// Set environment
Cashfree.XClientId = process.env.APP_ID;
Cashfree.XClientSecret = process.env.SECRET_KEY;
Cashfree.XEnvironment = "SANDBOX"; // Use "PRODUCTION" in real deployment

exports.createOrder = async (orderRequest) => {
  try {
    const response = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);

    if (response?.data?.payment_session_id) {
      return response.data;
    } else {
      throw new Error("Failed to create order: No payment_session_id");
    }
  } catch (error) {
    console.error("Error creating order:", error.message || error);
    throw error;
  }
};

exports.getPaymentStatus = async (orderId) => {
  try {
    const response = await Cashfree.PGFetchOrder("2023-08-01", orderId);

    if (response?.data?.order_status) {
      return { order_status: response.data.order_status };
    } else {
      throw new Error("Failed to fetch payment status");
    }
  } catch (error) {
    console.error("Error fetching payment status:", error.message || error);
    throw error;
  }
};
