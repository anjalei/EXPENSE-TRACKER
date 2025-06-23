let totalexpenses = 0;
let currentPage = 1;
let pageSize = 10;
let totalPages = 1;


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forms");
  form.addEventListener("submit", addExpense);
  fetchExpenses();
  document.getElementById("leaderboard-btn").addEventListener("click", showLeaderboard);
});

document.getElementById("pageSize").addEventListener("change", e => {
  pageSize = parseInt(e.target.value, 10);
  currentPage = 1;
  fetchExpenses();
});

document.getElementById("prevPageBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchExpenses();
  }
});

document.getElementById("nextPageBtn").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchExpenses();
  }
});


async function fetchExpenses() {
  try {
    const token = localStorage.getItem("token");
    console.log("🔁 fetchExpenses() token:", token);


    const res = await axios.get(
      `http://localhost:3000/api/expense?page=${currentPage}&limit=${pageSize}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const userStatusRes = await axios.get(
      "http://localhost:3000/api/user/status",
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const isPremiumUser = userStatusRes.data.isPremium;

    const {
      expenses,
      totalCount,
      totalExpense: serverTotalExpense,
      currentPage: serverPage,
      pageSize: serverPageSize
    } = res.data;
    totalPages = Math.ceil(totalCount / serverPageSize);
    currentPage = serverPage;
    pageSize = serverPageSize;

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


    const listEl = document.getElementById("allExpenselist");
    listEl.innerHTML = "";
    expenses.forEach(exp => showExpenseOnScreen(exp));

    totalexpenses = parseFloat(serverTotalExpense);
    document.getElementById("totalExpenses").textContent =
      `Total Expenses : ₹${totalexpenses}`;

    document.getElementById("pageInfo").textContent =
      `Page ${currentPage} of ${totalPages}`;

      if (totalPages === 0) {
  currentPage = 1;
  totalPages = 1;
}

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
  const note=document.getElementById("note").value;
  const obj = { expenseamount, description, category , note};

  await addNewExpenses(obj);
}

async function addNewExpenses(obj) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post("http://localhost:3000/api/postexpense", obj, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const { expense, totalExpense } = res.data;


    showExpenseOnScreen(expense);

    totalexpenses = parseFloat(totalExpense);
    document.getElementById("totalExpenses").textContent = `Total Expenses : ₹${totalexpenses}`;

  
    document.getElementById("expenseamount").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
     document.getElementById("note").value="";

  } catch (error) {
    console.error(error);
    alert(`Error: ${error.message}`);
    document.body.innerHTML += "Something went wrong";
  }
}

function showExpenseOnScreen(expense) {
const parent = document.getElementById("allExpenselist");
  const li = document.createElement("li");
  li.id = expense.id;

  li.innerHTML = `
  <strong>Amount:</strong> ₹${expense.expenseamount} <br>
  <strong>Description:</strong> ${expense.description} <br>
  <strong>Category:</strong> ${expense.category} <br>
  <strong>Note:</strong> ${expense.note ? expense.note : '—'} <br>
  <input type="button" value="Delete" onclick="deleteExpense('${expense.id}')">
  <input type="button" value="Edit" onclick="editExpense('${expense.id}', '${expense.expenseamount}', '${expense.description}', '${expense.category}', \`${expense.note || ""}\`)">
`;


  parent.appendChild(li);
}

async function deleteExpense(expenseId) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`http://localhost:3000/api/deleteexpense/${expenseId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

   
    const expenseDetails = document.getElementById(expenseId);
    if (expenseDetails) expenseDetails.remove();

  
    totalexpenses = res.data.totalExpense;
    document.getElementById("totalExpenses").textContent = `Total Expenses : ₹${totalexpenses}`;
    console.log("Expense deleted successfully.");
 await fetchExpenses();
  } catch (error) {
    console.error(error);
    alert(`Error: ${error.message}`);
    document.body.innerHTML += "Something went wrong";
  }
}

async function editExpense(expenseId, expenseamount, description, category,note) {

  document.getElementById("expenseamount").value = expenseamount;
  document.getElementById("description").value = description;
  document.getElementById("category").value = category;
  document.getElementById("note").value= note;

  
  const expenseDetails = document.getElementById(expenseId);
  if (expenseDetails) expenseDetails.remove();


  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.textContent = "Update Expense";

  submitButton.onclick = async function (event) {
    event.preventDefault();
    try {
      const updatedExpense = {
        expenseamount: document.getElementById("expenseamount").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        note:document.getElementById("note").value,
      };

      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:3000/api/updateexpense/${expenseId}`,
        updatedExpense,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const updatedTotal = res.data.totalExpense;
      totalexpenses = updatedTotal;
      document.getElementById("totalExpenses").textContent = `Total Expenses : ₹${totalexpenses}`;

 document.getElementById("allExpenselist").innerHTML = "";

      await fetchExpenses();

     
      document.getElementById("expenseamount").value = "";
      document.getElementById("description").value = "";
      document.getElementById("category").value = "";
      document.getElementById("note").value="";
      submitButton.textContent = "ADD";
      submitButton.onclick = (e) => addExpense(e);

    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
      document.body.innerHTML += "Something went wrong";
    }
  };
}