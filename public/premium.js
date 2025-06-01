document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-button");
  const statusDiv   = document.getElementById("status-message");
  const backBtn     = document.getElementById("back-button");
   const params = new URLSearchParams(window.location.search); 
 const token = localStorage.getItem("token");

  const cashfree = Cashfree({ mode: "sandbox" });

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
  try {
        console.log("📦 Sending token:", token);
  
    const response = await axios.post(
          "http://localhost:3000/payment/pay",
          { amount: 100 },
      {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
      }
    );

        const paymentSessionId = response.data.payment_session_id;
    
        let checkoutOptions = {
          paymentSessionId,
          redirectTarget: "_self",
        };

        await cashfree.checkout(checkoutOptions);
      } catch (err) {
        console.error("Payment Error 💥:", err);
      }
    });
  }

  // Handle payment result
 
  const success = params.get("success");

  if (success === "true") {
    statusDiv.innerHTML = `<h2 style="color:green;">🎉 Payment Successful! You are now a Premium Member.</h2>`;
  } else if (success === "false") {
    statusDiv.innerHTML = `<h2 style="color:red;">❌ Payment Failed or Cancelled. Please try again.</h2>`;
    }

  // Check premium status
  if (token) {
    axios.get("http://localhost:3000/api/user/status", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(({ data }) => {
      if (data.isPremium && success !== "true") {
        statusDiv.innerHTML = `<h2 style="color:blue;">⭐ You are already a Premium Member.</h2>`;
      }
    })
    .catch(err => console.error("Error checking user status", err));
  }

  // Back button
  backBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
window.location.href = "/login.html";
    // window.location.href = "/expense.html";
});
});