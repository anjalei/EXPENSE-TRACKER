window.addEventListener("DOMContentLoaded", () => {
    fetchUser();
});

async function fetchUser() {
    try {
        const res = await axios.get("http://localhost:3000/api/user");
        const users = res.data;
        document.getElementById("userlist").innerHTML = "";

        users.forEach((user) => {
            showUserOnScreen(user);
        });

       // document.getElementById("users").textContent = `${users}`;
    } catch (error) {
        document.body.innerHTML += "Something went wrong";
        console.log(error);
    }
}

async function addUser(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const obj = { username,email,password};

    
    if (!username || !email || !password) {
        alert("Please fill all the fields!");
        return;
    }


    await addNewUser(obj);
}

async function addNewUser(obj) {
    try {
        const res = await axios.post("http://localhost:3000/api/post", obj);
        showUserOnScreen(res.data);
        console.log(res);
   
        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    } catch (error) {
        document.body.innerHTML += "Something went wrong";
        console.log(error);
    }
}

function showUserOnScreen(user) {
    const parent = document.getElementById("users");
    const li = document.createElement("li");
    li.id = user.id; 

    li.innerHTML = `${user.username} `
    parent.appendChild(li);
   
}
