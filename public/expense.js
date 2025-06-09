let totalexpenses = 0;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forms");
  form.addEventListener("submit", addExpense);
  fetchExpenses();
  document.getElementById("leaderboard-btn").addEventListener("click", showLeaderboard);
});

async function fetchExpenses() {
  try {
    const token = localStorage.getItem("token");
    console.log("🔁 fetchExpenses() token:", token);

    const res = await axios.get("http://localhost:3000/api/expense", {
      headers: { 'Authorization': `Bearer ${token}` }
    });
const userStatusRes = await axios.get("http://localhost:3000/api/user/status", {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const isPremiumUser = userStatusRes.data.isPremium;
  
    const expenses = res.data.expenses;

  
    if (isPremiumUser) {
      document.getElementById("premium-msg").innerText = "🌟 You are a premium user now!";
      document.getElementById("checkout-button").style.display = "none";
      document.getElementById("leaderboard-btn").style.display = "block";
      document.getElementById("downloadBtn").style.display = "block";
      document.getElementById("premium-section").style.display = "block";


    } else {
      document.getElementById("premium-msg").innerText = "";
      document.getElementById("checkout-button").style.display = "inline-block";
      document.getElementById("leaderboard-btn").style.display = "none";
      document.getElementById("downloadBtn").style.display = "none";
      document.getElementById("premium-section").style.display = "none";

    }

    
    document.getElementById("expenselist").innerHTML = "";
    totalexpenses = 0;

    expenses.forEach((expense) => {
      showExpenseOnScreen(expense);
      totalexpenses += parseFloat(expense.expenseamount);
    });

    document.getElementById("totalExpenses").textContent = `Total Expenses : ₹${totalexpenses}`;

  } catch (error) {
    console.error(error);
    alert(`Error: ${error.message}`);
    document.body.innerHTML += "Something went wrong";
  }
}

async function showLeaderboard() {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get("http://localhost:3000/api/premium/leaderboard", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const leaderboardData = res.data;

    const leaderboardSection = document.getElementById("leaderboard");
    leaderboardSection.innerHTML = "<h3>🏆 Leaderboard</h3>";

    const list = document.createElement("ol");
    leaderboardData.forEach(user => {
      const listItem = document.createElement("li");
      listItem.textContent = `${user.username} - ₹${user.totalSpent}`;
      list.appendChild(listItem);
    });
    leaderboardSection.appendChild(list);

  } catch (err) {
    console.error("Error fetching leaderboard", err);
    alert("Failed to load leaderboard.");
  }
}

async function addExpense(event) {
  event.preventDefault();
  console.log("adding expense");
  const expenseamount = document.getElementById("expenseamount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const obj = { expenseamount, description, category };

  await addNewExpenses(obj);
}

async function addNewExpenses(obj) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post("http://localhost:3000/api/postexpense", obj, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // The backend returns { expense: newExpense, totalExpense: updatedTotal }
    const { expense, totalExpense } = res.data;

    // 1. Show the new expense in the list
    showExpenseOnScreen(expense);

    // 2. Update the total from the server
    totalexpenses = parseFloat(totalExpense);
    document.getElementById("totalExpenses").textContent = `Total Expenses : ₹${totalexpenses}`;

    // 3. Clear the input fields
    document.getElementById("expenseamount").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";

  } catch (error) {
    console.error(error);
    alert(`Error: ${error.message}`);
    document.body.innerHTML += "Something went wrong";
  }
}

function showExpenseOnScreen(expense) {
  const parent = document.getElementById("expenselist");
  const li = document.createElement("li");
  li.id = expense.id;

  li.innerHTML = `
    ${expense.expenseamount} ${expense.description} ${expense.category}
    <input type="button" value="Delete" onclick="deleteExpense('${expense.id}')">
    <input type="button" value="Edit" onclick="editExpense('${expense.id}', '${expense.expenseamount}', '${expense.description}', '${expense.category}')">
  `;

  parent.appendChild(li);
}

async function deleteExpense(expenseId) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`http://localhost:3000/api/deleteexpense/${expenseId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // Remove from DOM
    const expenseDetails = document.getElementById(expenseId);
    if (expenseDetails) expenseDetails.remove();

    // Update total from server response
    totalexpenses = res.data.totalExpense;
    document.getElementById("totalExpenses").textContent = `Total Expenses : ₹${totalexpenses}`;
    console.log("Expense deleted successfully.");

  } catch (error) {
    console.error(error);
    alert(`Error: ${error.message}`);
    document.body.innerHTML += "Something went wrong";
  }
}

async function editExpense(expenseId, expenseamount, description, category) {
  // 1. Pre-fill the form
  document.getElementById("expenseamount").value = expenseamount;
  document.getElementById("description").value = description;
  document.getElementById("category").value = category;

  // 2. Remove the item from the list (we’ll re-render everything upon success)
  const expenseDetails = document.getElementById(expenseId);
  if (expenseDetails) expenseDetails.remove();

  // 3. Change the submit button into “Update”
  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.textContent = "Update Expense";

  // 4. Replace its onclick with the update-routine
  submitButton.onclick = async function (event) {
    event.preventDefault();
    try {
      const updatedExpense = {
        expenseamount: document.getElementById("expenseamount").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
      };

      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:3000/api/updateexpense/${expenseId}`,
        updatedExpense,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      // Backend returns { message: "...", totalExpense: updatedTotal }
      const updatedTotal = res.data.totalExpense;
      totalexpenses = updatedTotal;
      document.getElementById("totalExpenses").textContent = `Total Expenses : ₹${totalexpenses}`;

      // Clear the old list and re-fetch everything fresh
      document.getElementById("expenselist").innerHTML = "";
      await fetchExpenses();

      // Clear the inputs
      document.getElementById("expenseamount").value = "";
      document.getElementById("description").value = "";
      document.getElementById("category").value = "";

      // Restore the button to normal “ADD” behavior
      submitButton.textContent = "ADD";
      submitButton.onclick = (e) => addExpense(e);

    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
      document.body.innerHTML += "Something went wrong";
    }
  };
}