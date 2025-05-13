document.addEventListener("DOMContentLoaded", function () {
const stripe = Stripe("pk_test_51RMgRXPslAih4KSM2pbKfnWtqIGpYQWp1BXJQzJPCjROm3PRjeYm60dSFndija1BD89Sqd3taTMZnvVdoRoqwpYi00H2Mh4IOm");

document.getElementById("checkout-button").addEventListener("click", async () => {
  try {
  
    const response = await axios.post(
      "http://localhost:3000/api/create-checkout-session",
      {},  
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    );

    const sessionId = response.data.sessionId;
    
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error("Stripe redirect error:", error);
      alert("TRANSACTION FAILED");
    }

  } catch (err) {
    console.error("Checkout session error:", err);
    alert("TRANSACTION FAILED");
  }
});
});
