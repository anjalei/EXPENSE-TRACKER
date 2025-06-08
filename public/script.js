

document.addEventListener("DOMContentLoaded", () => {
  // ───── Signup ─────
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", addUser);
  }

  // ───── Login ─────
  const loginForm = document.getElementById("forms");  // your login <form id="forms">
  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }
});
async function addUser(event) {
    event.preventDefault();
    const username = document.getElementById("username")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const obj = { username, email, password };

    if (!username || !email || !password) {
        alert("Please fill all the fields!");
        return;
    }

    try {
        const res = await axios.post("http://localhost:3000/api/post", obj);

       
        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        
        alert('Signup successful!');
        window.location.href = 'login.html';

    } catch (error) {
        console.error(error);
        alert('Something went wrong during signup.');
    }
}


async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById("loginemail")?.value;
    const password = document.getElementById("loginpassword")?.value;

    if (!email || !password) {
        alert("Please fill all the fields!");
        return;
    }

    try {
        const res = await axios.post("http://localhost:3000/api/login", { email, password });
        
        localStorage.setItem('token', res.data.token);
        alert(res.data.message);
         

        window.location.href = 'expense.html';
        
       
    } catch (error) {
        console.error(error);

        if (error.response && error.response.data && error.response.data.error) {
            alert(error.response.data.error);
        } else {
            alert('Something went wrong during login.');
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
  const forgotBtn = document.getElementById("forgot-password-btn");
  const forgotForm = document.getElementById("forgot-password-form");
  const resetForm = document.getElementById("reset-password-form");

  if (forgotBtn && forgotForm && resetForm) {
    // Show form on click
    forgotBtn.addEventListener("click", () => {
      forgotForm.style.display = "block";
    });

    // Handle form submission
    resetForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("reset-email").value;

      try {
        await axios.post("http://localhost:3000/api/password/forgotpassword", { email });
        alert("If the email exists, a reset link has been sent.");
        resetForm.reset();
        forgotForm.style.display = "none";
      } catch (error) {
        console.error("Password reset error:", error);
        alert("Something went wrong. Try again.");
      }
    });
  }
});