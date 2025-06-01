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
            headers: {
                'Authorization': `Bearer ${token}`  
            }
        });
     const isPremiumUser = res.data.isPremium;
    const expenses = res.data.expenses; 

        if (isPremiumUser) {
            document.getElementById("premium-msg").innerText = "🌟 You are a premium user now!";
            document.getElementById("checkout-button").style.display = "none"; 
            document.getElementById("leaderboard-btn").style.display = "block"; 
          
        } else {
            document.getElementById("premium-msg").innerText = "";  
            document.getElementById("checkout-button").style.display = "inline-block";  
            document.getElementById("leaderboard-btn").style.display = "none"; 
        }

        document.getElementById("expenselist").innerHTML = "";
        totalexpenses = 0;  
        expenses.forEach((expense) => {
            showExpenseOnScreen(expense);
        });

        document.getElementById("totalExpenses").textContent = `Total Expenses : ${totalexpenses}`;

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

        const leaderboardData = res.data.leaderboard;

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
    console.log('adding expense');
    event.preventDefault();
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
            headers: {
                'Authorization': `Bearer ${token}`  
            }
        });
        showExpenseOnScreen(res.data);
        console.log(res);

        document.getElementById("totalExpenses").textContent = `Total Expenses : ${totalexpenses}`;
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
        <input type="button" value="Delete" onclick="deleteExpense('${expense.id}', '${expense.expenseamount}')">
        <input type="button" value="Edit" onclick="editExpense('${expense.id}', '${expense.expenseamount}', '${expense.description}', '${expense.category}')">
    `;

    parent.appendChild(li);
    totalexpenses += +expense.expenseamount;
}

async function deleteExpense(expenseId, expenseamount) {
    try {
        const token = localStorage.getItem("token"); 

      
        const res = await axios.delete(`http://localhost:3000/api/deleteexpense/${expenseId}`, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        const expenseDetails = document.getElementById(expenseId);
        if (expenseDetails) expenseDetails.remove();

        totalexpenses -= +expenseamount;
        document.getElementById("totalExpenses").textContent = `Total Expenses : ${totalexpenses}`;
        console.log("Expense deleted successfully.");
    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
        document.body.innerHTML += "Something went wrong";
    }
}

async function editExpense(expenseId, expenseamount, description, category) {
    console.log(expenseId, expenseamount, description, category);

    document.getElementById("expenseamount").value = expenseamount;
    document.getElementById("description").value = description;
    document.getElementById("category").value = category;

    const expenseDetails = document.getElementById(expenseId);
    if (expenseDetails) expenseDetails.remove();

    totalexpenses -= +expenseamount
    document.getElementById("totalExpenses").textContent = `Total Expenses : ${totalexpenses}`;

    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.textContent = "Update Expense";

    submitButton.onclick = async function (event) {
        event.preventDefault();
        const updatedExpense = {
            expenseamount: document.getElementById("expenseamount").value,
            description: document.getElementById("description").value,
            category: document.getElementById("category").value,
        };

        try {
            const token = localStorage.getItem("token");  // Get JWT token from localStorage
            await axios.put(`http://localhost:3000/api/updateexpense/${expenseId}`, updatedExpense, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Send token in the Authorization header
                }
            });

            totalexpenses = 0;  // Recalculate total expenses after edit
            document.getElementById("expenselist").innerHTML = "";
            await fetchExpenses();  // Re-fetch the expenses list

            document.getElementById("expenseamount").value = "";
            document.getElementById("description").value = "";
            document.getElementById("category").value = "";

            submitButton.textContent = "ADD";
            submitButton.onclick = (event) => addExpense(event);
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
            document.body.innerHTML += "Something went wrong";
        }        
    }; 
}