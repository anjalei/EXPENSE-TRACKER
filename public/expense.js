
let totalexpenses = 0;

window.addEventListener("DOMContentLoaded", () => {
    fetchExpenses();
});

const form = document.getElementById('forms');
form.addEventListener('submit', addExpense);

async function fetchExpenses() {
    try {
        const res = await axios.get("http://localhost:3000/api/expense");
        const users = res.data;
        document.getElementById("expenselist").innerHTML = "";

        users.forEach((expense) => {
            showExpenseOnScreen(expense);
        });

        document.getElementById("totalExpenses").textContent = `Total Expenses : ${totalexpenses}`;
    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
        document.body.innerHTML += "Something went wrong";
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
        const res = await axios.post("http://localhost:3000/api/postexpense", obj);
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

    li.innerHTML = `${expense.expenseamount} ${expense.description} ${expense.category}
    <input type="button" value="Delete" onclick="deleteExpense('${expense.id}','${expense.expenseamount}')">
    <input type="button" value="Edit" onclick="editExpense('${expense.id}','${expense.expenseamount}','${expense.description}','${expense.category}')">`;

    parent.appendChild(li);
    totalexpenses+= +expense.expenseamount;
   
}

async function deleteExpense(expenseId,expenseamount) {
    try {
        await axios.delete(`http://localhost:3000/api/deleteexpense/${expenseId}`);
        const expenseDetails = document.getElementById(expenseId);
        if (expenseDetails) expenseDetails.remove();

        totalexpenses-= +expenseamount;
        
        document.getElementById("totalExpenses").textContent = `Total Expenses : ${totalexpenses}`;
       
        console.log("Expense deleted successfully.");
    }catch (error) {
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
            console.log(expenseId);
            await axios.put(`http://localhost:3000/api/updateexpense/${expenseId}`, updatedExpense);
            // totalexpenses+= +updatedExpense.expenseamount
            // document.getElementById("totalExpenses").textContent = `Total Expenses : ${totalexpenses}`;
totalexpenses=0;
            document.getElementById("expenselist").innerHTML = "";
            await fetchExpenses();

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
